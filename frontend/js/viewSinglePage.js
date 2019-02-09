const getParamaterId = () => {
    return window.location.href.split('?id=')[1];
}

const getParty = (callback) => {
    return fetch(`${apiNavigations('party')}/${getParamaterId() || '' }`, {
    headers: {
    'x-access-token': localStorage.getItem('token')
    }})
        .then((response) => {
            return response.json().then((resp) => {
                if (response.status === 404 || response.status === 401 ) {
                    return callback(resp.error, null);
                }
                return callback(null, resp.data[0]);
            })
        })
}

const getOffice = (callback) => {
    return fetch(`${apiNavigations('office')}/${getParamaterId() || '' }`, {
    headers: {
    'x-access-token': localStorage.getItem('token')
    }})
        .then((response) => {
            return response.json().then((resp) => {
                if (response.status === 404 || response.status === 401 ) {
                    return callback(resp.error, null);
                }
                return callback(null, resp.data[0]);
            })
        })
}
