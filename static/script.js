// Server Channel Generation

const serverData = [];

for (let i = 0; i < serverChannels.length; i++) {
    serverData.push(serverChannels[i]);
}

const categoryLimit = 50;
const channelLimit = 500;
const textChannelPermissions = [
  { "name": "CREATE_INSTANT_INVITE",       "value": 1 },
  { "name": "MANAGE_CHANNELS",             "value": 16 },
  { "name": "ADD_REACTIONS",               "value": 64 },
  { "name": "VIEW_CHANNEL",                "value": 1024 },
  { "name": "SEND_MESSAGES",               "value": 2048 },
  { "name": "SEND_TTS_MESSAGES",           "value": 4096 },
  { "name": "MANAGE_MESSAGES",             "value": 8192 },
  { "name": "EMBED_LINKS",                 "value": 16384 },
  { "name": "ATTACH_FILES",                "value": 32768 },
  { "name": "READ_MESSAGE_HISTORY",        "value": 65536 },
  { "name": "MENTION_EVERYONE",            "value": 131072 },
  { "name": "USE_EXTERNAL_EMOJIS",         "value": 262144 },
  { "name": "MANAGE_ROLES",                "value": 268435456 },
  { "name": "MANAGE_WEBHOOKS",             "value": 536870912 },
  { "name": "USE_APPLICATION_COMMANDS",    "value": 2147483648 },
  { "name": "MANAGE_THREADS",              "value": 17179869184 },
  { "name": "CREATE_PUBLIC_THREADS",       "value": 34359738368 },
  { "name": "CREATE_PRIVATE_THREADS",      "value": 68719476736 },
  { "name": "USE_EXTERNAL_STICKERS",       "value": 137438953472 },
  { "name": "SEND_MESSAGES_IN_THREADS",    "value": 274877906944 },
  { "name": "USE_EMBEDDED_ACTIVITIES",     "value": 549755813888 },
  { "name": "SEND_VOICE_MESSAGES",         "value": 70368744177664 },
  { "name": "SEND_POLLS",                  "value": 562949953421312 },
  { "name": "USE_EXTERNAL_APPS",           "value": 1125899906842624 }
];


const voiceChannelPermissions = [1, 2, 3, 4, 6];

serverGenModule = document.getElementById('server-gen-module');
noofcategory = document.getElementById('noofcategory');
btnRevealCategorylList = document.getElementById('btn-reveal-category-list');
categoryList = document.querySelector('#category-list');
btnCategoryName = document.querySelector('#btn-category-name');
categoryname = document.querySelector('#categoryname');
categories = null;
currentCategory = null;
serverGenConfirmation = document.querySelector('.serverGenConfirmation');
labelNoofchannel = document.querySelector('#label-noofchannel');
noofchannel = document.querySelector('#noofchannel');
channelCount = 0;
btnRevealChannelList = document.querySelector('#btn-reveal-channel-list');
channelList = document.querySelector('#channel-list');
btnChannelName = document.querySelector('#btn-channel-name')
channelname = document.querySelector('#channelname')
channels = null;
currentChannel = null;
permissionsList = document.querySelector('#permission-list');
permissions = null;
typeTextChannel = document.querySelector('#text-channel');
textChannelPermissionsToBeApplied = null;


btns = document.querySelectorAll('.btn-module');

btns.forEach(btn => {
    btn.addEventListener('click', function() {
        module = btn.parentElement;
        moduleChildrens = module.children;       
        module.classList.add('module-expanded', 'text-left', 'flex-column');
        
        Array.from(moduleChildrens).forEach(child => {
            if (child.classList.contains('d-none')) {
                child.classList.remove('d-none');
            };
        });

        btn.classList.add('d-none');
        displayCategory();
        categories = document.querySelectorAll('.categories');
        selectCategory();
    });
});


btnRevealCategorylList.addEventListener('click', function() {
    withinCategoryLimit = noofcategory.value >= 1 && noofcategory.value <= categoryLimit;


    if (withinCategoryLimit) {
        let num = 1
        for (let i = 0; i < serverData.length; i++) {
            if (serverData[i]["type"] == 4) {
                num += 1;
            }
        }

        for (let i = 0; i < noofcategory.value; num++, i++) {
            serverData.push({"name":"Category " + num, "parent_id":null, "position":i, "type":4, "permission_overwrites":[]})
        };
        
        displayCategory();
        
        categories = document.querySelectorAll('.categories');
        
        selectCategory();
        changeCategoryName();

        console.log(serverChannels);
        console.log(serverData);
    };
});



btnRevealChannelList.addEventListener('click', function() {
    withinChannelLimit = channelCount + parseInt(noofchannel.value) <= channelLimit;

    if (noofchannel != '' && withinChannelLimit) {
        channelCount += parseInt(noofchannel.value);
        labelNoofchannel.innerHTML = `No of Channel to be added (${channelCount} out of 500 Used): `;

        for (let i = 0, num = serverData[currentCategory.slice(-2) - 1]['channels'].length + 1; i < noofchannel.value; num++, i++) {
            serverData[currentCategory.slice(-2) - 1].channels.push({"name":"Channel " + num});
        };

        displayChannel()

        channels = document.querySelectorAll('.channels');

        selectChannel();
        changeChannelName();

    };
});




function selectCategory() {
    categories.forEach(category => {
        category.addEventListener('click', function() {
            channelList.innerHTML = 'None';
            currentCategory = category.id;
            clearSelectedCategory();
            category.classList.remove('btn-outline-secondary');
            category.classList.add('btn-success', 'disabled');


            labelNoofchannel.innerHTML = `No of Channel to be added (${channelCount} out of 500 Used): `;

            displayChannel();

            channels = document.querySelectorAll('.channels');

            selectChannel();
            changeChannelName();
        });
    });
};


function changeCategoryName() {
    btnCategoryName.addEventListener('click', function() {
        if (categoryname.value != '') {
            serverData[currentCategory.slice(-2) - 1].name = categoryname.value;
            document.querySelector(`#${currentCategory}`).innerHTML = categoryname.value;
        };
    });
};


function clearSelectedCategory() {
    categories.forEach(category => {
        if (category.classList.contains('btn-success')) {
            category.classList.remove('btn-success', 'disabled');
            category.classList.add('btn-outline-secondary')
        };
    });
}

function displayCategory() {
    categoryList.innerHTML = '';

    for (let i = 0; i < serverData.length; i++) {
        if (serverData[i]["type"] == 4) {
            id = i >= 9 ? i + 1 : '0' + (i + 1);
            categoryList.innerHTML += `<span class="categories btn btn-outline-secondary" id="category-${id}">${serverData[i]["name"]}</span>`;
        };
    };
};


function clearSelectedChannel() {
    channels.forEach(channel => {
        if (channel.classList.contains('btn-success')) {
            channel.classList.remove('btn-success', 'disabled');
            channel.classList.add('btn-outline-secondary')
        };
    });
}


function displayChannel() {
    channelList.innerHTML = '';

    for (let i = 0; i < serverChannels.length; i++) {
        if (serverChannels[i]["type"] == 0 || serverChannels[i]["type"] == 2) {
            channelList.innerHTML += `<span class="channels btn btn-outline-secondary" id="channel-${serverChannels[i]['id']}">${serverChannels[i]['name']}</span>`;
        };
    };

    if (serverData[currentCategory.slice(-2) - 1]['channels'] == undefined) {
        return
    }

    for (let i = 0; i < serverData[currentCategory.slice(-2) - 1]['channels'].length; i++) {
        id = i >= 9 ? i + 1 : '0' + (i + 1);
        channelList.innerHTML += `<span class="channels btn btn-outline-secondary" id="channel-${id}">${serverData[currentCategory.slice(-2) - 1]['channels'][i]['name']}</span>`;
    };
}


function selectChannel() {
    channels.forEach(channel => {
        channel.addEventListener('click', function() {
            currentChannel = channel.id;
            clearSelectedChannel();
            channel.classList.remove('btn-outline-secondary');
            channel.classList.add('btn-success', 'disabled');
            btnChannelName.classList.remove('disabled');

            displayPermissions();
        });
    });
};


function changeChannelName() {
    btnChannelName.addEventListener('click', function() {
        if (channelname.value != '') {
            btnChannelName.classList.add('disabled');
            serverData[currentCategory.slice(-2) - 1]['channels'][currentChannel.slice(-2) - 1]['name']= channelname.value;
            document.querySelector(`#${currentChannel}`).innerHTML = channelname.value;
        };
    });
};


function displayPermissions() {
    permissionsList.innerHTML = '';
    for (let i = 0; i < (typeTextChannel.checked ? textChannelPermissions.length: voiceChannelPermissions.length); i++) {
        permissionsList.innerHTML += `<span class="permissions btn btn-danger" id="${textChannelPermissions[i]["name"]}">${textChannelPermissions[i]["name"]}</span>`;
    };



    permissions = document.querySelectorAll('.permissions');
    selectPermissions();
};


function selectPermissions() {
    permissions.forEach(permission => {
        permission.addEventListener('click', function() {
            if (permission.classList.contains('btn-danger')) {
                permission.classList.remove('btn-danger');
                permission.classList.add('btn-success')
            }
            else if (permission.classList.contains('btn-success')) {
                permission.classList.remove('btn-success');
                permission.classList.add('btn-danger')
            }
        });
    });
};

