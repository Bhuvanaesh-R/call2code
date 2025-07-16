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


btnRevealCategorylList.addEventListener('click', function() {
    withinCategoryLimit = noofcategory.value > 1 && noofcategory.value <= categoryLimit;


    if (withinCategoryLimit) {
        btnRevealCategorylList.classList.add('disabled');

        for (let i = 1; i <= noofcategory.value; i++) {
            serverData.push({"name":"Category " + i, "channels":[]})
        };
        
        displayCategory();

        categories = document.querySelectorAll('.categories');
        
        selectCategory();
        changeCategoryName();

        console.log(serverData)
    };
});



btnRevealChannelList.addEventListener('click', function() {
    channelCount += noofchannel.value;
    withinChannelLimit = channelCount <= channelLimit;

    if (noofchannel != '' && withinChannelLimit) {
        btnRevealChannelList.classList.add('disabled');
        labelNoofchannel.innerHTML = `No of Channel to be added (${channelCount} out of 500 Used): `;

        for (let i = 1; i <= noofchannel.value; i++) {
            serverData[currentCategory.slice(-2) - 1].channels.push({"name":"Channel " + i});
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
            currentCategory = category.id;
            clearSelectedCategory();
            category.classList.remove('btn-outline-secondary');
            category.classList.add('btn-success', 'disabled');
            btnCategoryName.classList.remove('disabled');


            labelNoofchannel.innerHTML = `No of Channel to be added (${channelCount} out of 500 Used): `;
        });
    });
};


function changeCategoryName() {
    btnCategoryName.addEventListener('click', function() {
        if (categoryname.value != '') {
            btnCategoryName.classList.add('disabled');
            btnRevealChannelList.classList.remove('disabled');
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
    for (let i = 0; i < noofchannel.value; i++) {
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
            serverData[currentCategory.slice(-2) - 1]['channels'][currentChannel.slice(-2) - 1]['name'].name = channelname.value;
            document.querySelector(`#${currentChannel}`).innerHTML = channelname.value;
        };
    });
};