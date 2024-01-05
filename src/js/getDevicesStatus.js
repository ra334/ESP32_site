async function getDevicesStatus(url) {
    let response = await fetch(url)
    let json;

    if (response.ok) {
        json = await response.json()
    } else {
        alert('Http error: ' + response.status)
    }

    return json
}

export default getDevicesStatus