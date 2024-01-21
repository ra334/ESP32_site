async function getSettings(url) {
    let response = await fetch(url)
    let json;

    if (response.ok) {
        json = await response.json()
    } else {
        alert('Http error: ' + response.status)
    }

    return json
}

async function setSettings(url, device1_data, device2_data, device3_data, device4_data, device_5_data) {

    await fetch(url, {
        method: 'POST',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            pump_1: device1_data,
            pump_2: device2_data,
            fan: device3_data,
            aux: device4_data,
            aux_work: device_5_data
        })
    })
}

export {getSettings, setSettings}