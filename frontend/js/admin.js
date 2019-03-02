document.querySelector('.load-overlay').style= 'display: flex;'
    getParty((error, partyInfo) => {
    const partyProfile = document.querySelector('.party-admin');
    if (error) {
        partyProfile.innerHTML = `<tr> <h2> ${error} </h2></tr>`;
        return;
    }
    partyInfo.forEach((party) => {
        partyProfile.innerHTML +=       `<tr>
            <td><img src="${party.logourl}" class="circle"> </td>
            <td> ${party.name}</td>
            <td> ${party.hqaddress} </td>
            <td>
            <a href="edit-party.html?id=${party.id}" class="button blue">edit</a>
            <a href="#delete" data-target="deleteAction" data-input='${party.id}' class="button red">delete</a>
            </td>
        </tr>`;
    });
        document.querySelector('.load-overlay').style= 'display: none;'
    });
