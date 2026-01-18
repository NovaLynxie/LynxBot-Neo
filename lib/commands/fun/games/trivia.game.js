// Powered by Open Trivia Database (https://opentdb.com)

async function fetchSessionToken() {
    try {
        const res = await fetch('https://opentdb.com/api_token.php?command=request');
        const data = await res.json(); // parse to readable json object
        return data.token;
    } catch (error) {
        console.error("Error fetching session token:", error);
        return null;
    };
};
async function fetchTriviaQuestions(options = { amount: 10, category: 9, difficulty: "", type: "", token: "" }) {
    if (options.token === "") {
        options.token = await fetchSessionToken(); // TODO: implement proper session token storage
    };
    try {
        const res = await fetch(`https://opentdb.com/api.php?amount=${options.amount}&category=${options.category}&difficulty=${options.difficulty}&type=${options.type}&token=${options.token}&encode=base64`);
        const data = await res.json(); // parse to readable json object
        // decode strings from base64 to utf-8 to make it readable
        Object.keys(data.results).forEach(key => {
            Object.keys(data.results[key]).forEach(subkey => {
                if (typeof data.results[key][subkey] === "object") {
                    data.results[key][subkey].forEach((item, index) => {
                        data.results[key][subkey][index] = Buffer.from(item, 'base64').toString('utf-8');
                    });
                } else {
                    data.results[key][subkey] = Buffer.from(data.results[key][subkey], 'base64').toString('utf-8');
                };
            });
        });
        return { data, options }; // return decoded data and options provided, in case token was updated
    } catch (error) {
        console.error("Error fetching trivia questions:", error);
        return null;
    }
};
async function getAllTriviaCategories() {
    const res = await fetch('https://opentdb.com/api_category.php');
    const data = await res.json();
    return data;
};