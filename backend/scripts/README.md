# Unsloth Fine-Tuning on Google Colab

This directory contains the script needed to fulfill the "Stretch Goal" of fine-tuning a small open model (Llama 3.2 3B) on your specific chat history, as per Section 4.2 of the PRD.

## How to run this in Google Colab

1. **Prepare your data:**
   Run the backend parser to extract your WhatsApp `.txt` file into a `pairs.json` file. Ensure it contains a JSON array of objects with `incoming_message` and `user_reply`.

2. **Open Google Colab:**
   Go to [Google Colab](https://colab.research.google.com/) and create a new Notebook.
   **Crucial step:** Go to `Runtime` -> `Change runtime type` and select **T4 GPU**.

3. **Upload Files:**
   In the Colab left sidebar (folder icon), upload:
   - `fine_tune_unsloth.py` (this script)
   - `pairs.json` (your extracted dataset)

4. **Install Dependencies (Cell 1):**
   Create a code cell and run:
   ```python
   !pip install "unsloth[colab-new] @ git+https://github.com/unslothai/unsloth.git"
   !pip install --no-deps xformers trl peft accelerate bitsandbytes
   ```

5. **Run the Script (Cell 2):**
   Create a new code cell and execute the script:
   ```python
   !python fine_tune_unsloth.py
   ```
   *(Note: You can open the `.py` file in Colab and edit the `USER_NAME` or `MAX_STEPS` before running).*

6. **Download the GGUF Model:**
   Once training completes (takes 10-20 minutes depending on dataset size), a new folder called `model_gguf` will be created. Inside, you'll find the `.gguf` file. Download this file to your laptop.

## Running Locally via Ollama

Once you have the `.gguf` file downloaded:

1. Create a `Modelfile` on your laptop in the same folder as the `.gguf` file:
   ```dockerfile
   FROM ./unsloth-llama-3.2-3b-instruct-q4_k_m.gguf
   TEMPLATE """{{ if .System }}<|start_header_id|>system<|end_header_id|>

   {{ .System }}<|eot_id|>{{ end }}{{ if .Prompt }}<|start_header_id|>user<|end_header_id|>

   {{ .Prompt }}<|eot_id|>{{ end }}<|start_header_id|>assistant<|end_header_id|>

   """
   ```

2. Import into Ollama:
   ```bash
   ollama create signet-clone -f Modelfile
   ```

3. Run it:
   ```bash
   ollama run signet-clone "Hey, are you free tomorrow?"
   ```
