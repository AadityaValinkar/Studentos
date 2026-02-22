const fs = require('fs');
fetch('https://internships-api.p.rapidapi.com/active-jb-7d', {
    headers: {
        'X-RapidAPI-Key': '151c9a32b4mshf169b37160d0295p11a30bjsnc51c12294f27',
        'X-RapidAPI-Host': 'internships-api.p.rapidapi.com'
    }
})
    .then(res => res.json())
    .then(data => fs.writeFileSync('tmp-api.json', JSON.stringify(data.slice(0, 5), null, 2)))
    .catch(console.error);
