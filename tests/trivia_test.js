(async() => {
    const res = await fetch('https://opentdb.com/api.php?amount=10&type=boolean&encode=base64');
    const data = await res.json();
    Object.keys(data.results).forEach(key => {
        //console.log(key, data.results[key]);
        Object.keys(data.results[key]).forEach(subkey => {
            console.log(typeof data.results[key][subkey]);
            switch (typeof data.results[key][subkey]) {
                case 'object':
                    data.results[key][subkey].forEach((item, index) => {
                        if (typeof item === 'string') {
                            data.results[key][subkey][index] = Buffer.from(item, 'base64').toString('utf-8');
                        }
                    });
                    break;
                case 'string':
                    data.results[key][subkey] = Buffer.from(data.results[key][subkey], 'base64').toString('utf-8');
                    break;
                default:
                    // Handle non-string values (e.g., numbers, booleans)
            }
            //console.log(subkey, data.results[key][subkey]);
        });
        //console.log(key, data.results[key]);
    });
    console.log(data);
})();