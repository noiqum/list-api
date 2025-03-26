import { GoogleGenAI } from "@google/genai"

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
})

const getAIreply = async (content: string) => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: content,
            config: {
                systemInstruction: "content which is provided description of a todo task , you are an advisor for how achieve todo task done . just give at most three one sentence advices about priority ,todo tag label , how to achieve task complitation and always return sentences with number list style like 1. text , 2. text ,3. text"
            }
        })

        return response.text

    } catch (error) {
        console.error(error)
        return
    }

}

export default getAIreply