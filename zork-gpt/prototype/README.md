# Start the prototype

 - start a commandline in the folder frontend/therapt. Run: 

    ```
    npm install 
    npm run dev
    ```

 - start a commandline in the folder backend. Run:
    
    ```python app.py```

Open http://localhost:3000/ on your browser. Chrome should work, firefox sometimes blocks the requests for security reasons (you can chane the settings if needed)

To use the Simple GPT Chatbot, you need to create a .env file in the chatbots folder. Paste in there

```
OPENAI_API_KEY = <your api key>
```

# Overview

You can subclass the ChatBot class you can see in app.py in another class. Then add it into the function get_model and into the list models.
Just serve the functions and fields of the ChatBot class and everything should work.
