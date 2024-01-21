import getDevicesStatus from "./getDevicesStatus";
import {getSettings, setSettings} from "./settings";
import getTemperatures from "./getTemperatures";


function devicesStatus(prefix, changeType) {
    getDevicesStatus('/devices').then((data) => {
        const pump_1 = data.pump_1
        const pump_2 = data.pump_2
        const fan = data.fan
        const aux = data.aux
        let arr = [pump_1, pump_2, fan, aux]
        let counter = 1

        let classTypeOnline = ''
        let classTypeOffline = ''
        if (changeType === 'monitoring') {
            classTypeOnline = 'device__status-online'
            classTypeOffline = 'device__status-offline'
        } else {
            classTypeOnline = 'device__settings__status-online'
            classTypeOffline = 'device__settings__status-offline'
        }

        for (let device of arr) {
            const elem = document.getElementById(prefix + "_status_" + counter)
            elem.classList.remove()
            if (device === true) {
                elem.innerText = 'ON'
                elem.dataset.isActive = true
                elem.classList.add(classTypeOnline)
            } else {
                elem.innerText = 'OFF'
                elem.dataset.isActive = false
                elem.classList.add(classTypeOffline)
            }
            counter += 1
        }
    })
}

function monitoringChanger() {
    getTemperatures('/temperatures').then((data) => {
        const temperature_1 = data.temperature_1
        const temperature_2 = data.temperature_2

        document.getElementById("temperature_1").innerText = `${temperature_1}°`
        document.getElementById("temperature_2").innerText = `${temperature_2}°`
    })

    devicesStatus('monitor', 'monitoring')
}

async function setDataInputs() {
    const data = await getSettings('/settings')
    let arr = []

    for (let elem in data) {
        arr.push(data[elem])
    }

    for (let i = 0; i < 4; i++) {
        document.getElementById('start_' + (i + 1)).value = `${arr[i].start}`
        document.getElementById('stop_' + (i + 1)).value = `${arr[i].stop}`
    }
}

async function sendSettings() {
    let arr = []

    for (let i = 0; i < 4; i++) {
        const start_elem = document.getElementById('start_' + (i + 1)).value
        const stop_elem = document.getElementById('stop_' + (i + 1)).value
        const buttonState = document.getElementById('setting_status_' + (i + 1)).dataset.isActive
        if (start_elem === stop_elem) {
            const errorStr = `Device ${i + 1}: start == stop`
            alert(errorStr)
            throw new Error(errorStr)
        }
        arr.push({start: Number(start_elem), stop: Number(stop_elem), isActive: Boolean(buttonState)})
    }

    const checkboxData = document.getElementById('auxWork').checked

    if (checkboxData) {
        arr[3].isActive = false
    }

    await setSettings('/settings', arr[0], arr[1], arr[2], arr[3], checkboxData)
}


function toggleStatus(elementID) {
    const element = document.getElementById(elementID);

    element.addEventListener('click', () => {
        if (elementID === 'setting_status_1' || elementID === 'setting_status_4') {
            const otherElementID = (elementID === 'setting_status_1') ? 'setting_status_4' : 'setting_status_1';
            const otherElement = document.getElementById(otherElementID);

            if (otherElement.dataset.isActive === 'true') {
                otherElement.innerText = 'OFF';
                otherElement.classList.remove('device__settings__status-online');
                otherElement.classList.add('device__settings__status-offline');
                otherElement.dataset.isActive = false;
            }
        }

        if (element.innerText === 'ON') {
            element.innerText = 'OFF';
            element.classList.remove('device__settings__status-online');
            element.classList.add('device__settings__status-offline');
            element.dataset.isActive = false;
        } else {
            element.innerText = 'ON';
            element.classList.remove('device__settings__status-offline');
            element.classList.add('device__settings__status-online');
            element.dataset.isActive = true;
        }
    });
}


function customCheckBox() {
    toggleStatus('setting_status_1');
    toggleStatus('setting_status_2');
    toggleStatus('setting_status_3');
    toggleStatus('setting_status_4');
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("monitoring").classList.add('active_settings_button')
    document.querySelector(".settings").style.display = "none";

    let monitoringTimer = setInterval(monitoringChanger, 1000)
    
    document.getElementById("monitoring").addEventListener("click", function () {
        document.getElementById("monitoring").classList.add('active_settings_button')
        document.getElementById("settings").classList.remove('active_settings_button')
        document.querySelector(".monitoring").style.display = "flex";
        document.querySelector(".settings").style.display = "none";

        clearInterval(monitoringTimer)
        monitoringTimer = setInterval(monitoringChanger, 1000)
        
    });
    
    document.getElementById("settings").addEventListener("click", function () {
        document.getElementById("monitoring").classList.remove('active_settings_button')
        document.getElementById("settings").classList.add('active_settings_button')
        document.querySelector(".settings").style.display = "flex";
        document.querySelector(".monitoring").style.display = "none";
        
        setDataInputs()

        customCheckBox()
        
        clearInterval(monitoringTimer)
        devicesStatus('setting')
    });
    const buttonElement = document.getElementById("submmit_button")
    buttonElement.addEventListener("click", function () {
        sendSettings()
    });
});