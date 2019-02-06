
getOffice((error, officeInfo) => {
    const officeAll = document.querySelector('.offices');
    if (error) {
        officeAll.innerHTML = `<h2> ${error} </h2>`
        return;
    }
    if (getParamaterId() !== undefined) {
      officeAll.innerHTML = `
      <img src="${ officeInfo[0].logourl}" class="party-pix left">
      <div class="profile-menu">
      <h2 class="title font-serif p-name">
        <span id="p-name">${officeInfo[0].name.toUpperCase()}</span>
      </h2>
      <div class="">
        <strong>Name:</strong> @<span id="p-address">${officeInfo[0].type.toUpperCase()} </span>
      </div>
    </div>
      `;
    } else {
      officeAll.innerHTML = '';
      officeInfo.forEach((office) => {
          console.log(office);
        officeAll.innerHTML +=       `
            <div class="offices_office" style="height: auto;">
              <h3>
                <a href="./pages/office.html?id=${office.id}">${office.name.toUpperCase()}</a>
              </h3>
              <div class="offices_office_options">
                <span>${office.type.toUpperCase()}</span>
              </div>
            </div>`;
      })
    }
          document.querySelector('.load-overlay').style= 'display: none;'
});
