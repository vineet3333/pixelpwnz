"""
Unsloth LoRA Fine-tuning Script for Signet AI Clone

Run this script in a Google Colab notebook (T4 GPU).
Make sure to upload your `pairs.json` file to the Colab environment first.
"""

# ==========================================
# 1. Install Dependencies (Run in Colab cell)
# !pip install "unsloth[colab-new] @ git+https://github.com/unslothai/unsloth.git"
# !pip install --no-deps xformers trl peft accelerate bitsandbytes
# ==========================================

import json
from datasets import Dataset
from unsloth import FastLanguageModel
from trl import SFTTrainer
from transformers import TrainingArguments
from unsloth import is_bfloat16_supported

# ------------------------------------------
# CONFIGURATION
# ------------------------------------------
MODEL_NAME = "unsloth/Llama-3.2-3B-Instruct"  # or "unsloth/Llama-3.2-1B-Instruct" for lower memory
MAX_SEQ_LENGTH = 2048
DATA_FILE = "pairs.json"
USER_NAME = "User" # Change this to the name being cloned

# ------------------------------------------
# 2. Load Model & Tokenizer
# ------------------------------------------
print(f"Loading {MODEL_NAME}...")
model, tokenizer = FastLanguageModel.from_pretrained(
    model_name=MODEL_NAME,
    max_seq_length=MAX_SEQ_LENGTH,
    dtype=None,
    load_in_4bit=True,
)

# Apply LoRA adapters
model = FastLanguageModel.get_peft_model(
    model,
    r=16, # Choose any number > 0 ! Suggested 8, 16, 32, 64, 128
    target_modules=["q_proj", "k_proj", "v_proj", "o_proj",
                    "gate_proj", "up_proj", "down_proj",],
    lora_alpha=16,
    lora_dropout=0,
    bias="none",
    use_gradient_checkpointing="unsloth",
    random_state=3407,
    use_rslora=False,
    loftq_config=None,
)

# ------------------------------------------
# 3. Prepare Dataset (ChatML format)
# ------------------------------------------
print("Formatting dataset...")
with open(DATA_FILE, "r", encoding="utf-8") as f:
    raw_pairs = json.load(f)

# Convert to ChatML format
formatted_data = []
for pair in raw_pairs:
    incoming = pair.get("incoming_message", "")
    reply = pair.get("user_reply", "")
    
    if not incoming or not reply:
        continue
        
    chat = [
        {"role": "system", "content": f"You are {USER_NAME}. Reply to the user's message exactly how {USER_NAME} would."},
        {"role": "user", "content": incoming},
        {"role": "assistant", "content": reply}
    ]
    formatted_data.append({"messages": chat})

dataset = Dataset.from_list(formatted_data)

def format_chat_template(examples):
    texts = [tokenizer.apply_chat_template(msg, tokenize=False, add_generation_prompt=False) for msg in examples["messages"]]
    return {"text": texts}

dataset = dataset.map(format_chat_template, batched=True)

# ------------------------------------------
# 4. Train Model
# ------------------------------------------
print("Starting training...")
trainer = SFTTrainer(
    model=model,
    tokenizer=tokenizer,
    train_dataset=dataset,
    dataset_text_field="text",
    max_seq_length=MAX_SEQ_LENGTH,
    dataset_num_proc=2,
    packing=False,
    args=TrainingArguments(
        per_device_train_batch_size=2,
        gradient_accumulation_steps=4,
        warmup_steps=5,
        max_steps=60, # Increase for better results (e.g., 200-300 depending on dataset size)
        learning_rate=2e-4,
        fp16=not is_bfloat16_supported(),
        bf16=is_bfloat16_supported(),
        logging_steps=1,
        optim="adamw_8bit",
        weight_decay=0.01,
        lr_scheduler_type="linear",
        seed=3407,
        output_dir="outputs",
    ),
)

trainer_stats = trainer.train()

# ------------------------------------------
# 5. Export to GGUF (for Ollama)
# ------------------------------------------
print("Exporting model to GGUF...")
# Save LoRA weights locally first
model.save_pretrained("lora_model")
tokenizer.save_pretrained("lora_model")

# Export to GGUF in 4-bit quantization (Q4_K_M)
# This will push to Hub if you provide a token, or save locally if False
model.save_pretrained_gguf("model_gguf", tokenizer, quantization_method="q4_k_m")

print("Done! You can now download the .gguf file from the model_gguf directory and load it into Ollama.")
