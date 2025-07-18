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
    });
});


// Server Channel Generation

const serverData = [];
const categoryLimit = 50;
const channelLimit = 500;

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


btnRevealCategorylList.addEventListener('click', function() {
    withinCategoryLimit = noofcategory.value >= 1 && noofcategory.value <= categoryLimit;


    if (withinCategoryLimit) {
        for (let i = 0, num = serverData.length + 1; i < noofcategory.value; num++, i++) {
            serverData.push({"name":"Category " + num, "channels":[]})
        };
        
        displayCategory();

        categories = document.querySelectorAll('.categories');
        
        selectCategory();
        changeCategoryName();

        console.log(serverData)
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
        id = i >= 9 ? i + 1 : '0' + (i + 1);
        categoryList.innerHTML += `<span class="categories btn btn-outline-secondary" id="category-${id}">${serverData[i]["name"]}</span>`;
    };
}


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

/* 
function displayPermissions() {
    permissionsList.
} */