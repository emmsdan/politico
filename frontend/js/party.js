document.querySelector('.load-overlay').style= 'display: flex;'
    getParty((error, partyInfo) => {
    const partyProfile = document.querySelector('.top-profile');
    const partyAll = document.querySelector('.parties');
    if (error) {
        partyProfile.innerHTML = `<h2> ${error} </h2>`
        return;
    }
    if (getParamaterId() !== undefined) {
      partyProfile.innerHTML = `
      <img src="${ partyInfo[0].logourl}" class="party-pix left">
      <div class="profile-menu">
      <h2 class="title font-serif p-name">
        <span id="p-name">${partyInfo[0].name}</span>
      </h2>
      <div class="">
        <strong>Address:</strong> @<span id="p-address">${partyInfo[0].hqaddress} </span>
      </div>
    </div>
      `;
    } else {
      partyAll.innerHTML = '';
      partyInfo.forEach((party) => {
        partyAll.innerHTML +=       ` <div class="parties-party">
        <a href="/pages/party.html?id=${party.id}" class="parties-party-link">
          <img src="${party.logourl}">
        </a>
      </div>`;
      })
    }
      document.querySelector('.load-overlay').style= 'display: none;'
    });
