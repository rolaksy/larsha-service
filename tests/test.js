const dotenv = require('dotenv');
const Gitrows = require("./lib/gitrows");

let gitrowsOptions = {
    author: {
        name: 'rolaksy',
        email: '9laksy@gmail.com'
    },
    owner: 'rolaksy',
    user: 'rolaksy',
    token: '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',
    branch: 'master',
    csv: { delimiter: ',' },
    cacheTTL: 1000, // You can tweak this value to have a custom cache validity time (3s here)
    type: 'json' //yaml, csv, json
};

const gitrows = new Gitrows(gitrowsOptions);

//working tested
async function select(table, filters) {
    console.log('select started.');
    await gitrows.get(
        '@github/rolaksy/larsha-store/'+table+'/o.json',
        filters
    ).then(res => {console.log(res)}).catch(e => {console.log(e)});
}

//working tested
async function insert(table, data) {
    console.log('insert started.');
    await gitrows.put(
        '@github/rolaksy/larsha-store/'+table+'/o.json',
        data
    ).then(res => {console.log(res)}).catch(e => {console.log(e)});
}

//working tested
async function create(table) {
    console.log('create started.');
    await gitrows.create(
        '@github/rolaksy/larsha-store/'+table+'/o.json',
        []
    ).then(res => {console.log(res)}).catch(e => {console.log(e)});
}


async function update(table, data, filter) {
    console.log('update started.');
    await gitrows.update(
        '@github/rolaksy/larsha-store/'+table+'/o.json',
        data,
        filter
    ).then(res => {console.log(res)}).catch(e => {console.log(e)});
}

async function remove(table, filter) {
    console.log('update started.');
    await gitrows.delete(
        '@github/rolaksy/larsha-store/'+table+'/o.json',
        filter
    ).then(res => {console.log(res)}).catch(e => {console.log(e)});
}

async function drop(table) {
    console.log('update started.');
    await gitrows.drop(
        '@github/rolaksy/larsha-store/'+table+'/o.json'
    ).then(res => {console.log(res)}).catch(e => {console.log(e)});
}


async function handleRequest()
{
    console.log('handleRequest started.');
    const dataToInsert = {
        "name": "Laks Yalamati",
        "email": "xxxx@gmail.com",
        "__tt__": 0
    };

    create('ks-users');
    
    //drop('ks-users');
    //insert('ks-users', dataToInsert);

    //remove('ks-users', {"id": 101});
    
    //update('users', dataToInsert, {"id": "100"});

    select('ks-users', {"email": "9laksy@gmail.com"});
}



handleRequest();
