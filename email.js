function addNewLinkField() {
  const container = document.getElementById('linksContainer');
  const inputs = container.querySelectorAll('input.orgLink');
  const lastInput = inputs[inputs.length - 1];
  if (lastInput.value.trim() !== '' && !lastInput.disabled) {
    const newInput = document.createElement('input');
    newInput.type = 'text';
    newInput.className = 'orgLink';
    newInput.placeholder = 'Paste another link...';
    newInput.oninput = addNewLinkField;
    container.appendChild(newInput);
  }
}

document.getElementById('notOnYP').addEventListener('change', function () {
  const disabled = this.checked;
  const inputs = document.querySelectorAll('.orgLink');
  inputs.forEach(input => {
    input.disabled = disabled;
    if (disabled) {
      input.classList.add('readonly');
    } else {
      input.classList.remove('readonly');
    }
  });
});

document.getElementById('phone').addEventListener('change', function () {
  const newPhoneInput = document.getElementById('newPhone');
  newPhoneInput.classList.toggle('hidden', this.value !== 'add-new');
});

function formatPhone(phone) {
  const clean = phone.replace(/\D/g, '');
  return clean.length === 10
    ? `(${clean.slice(0,3)}) ${clean.slice(3,6)}-${clean.slice(6)}`
    : phone;
}

function copyText(elementId) {
  const el = document.getElementById(elementId);
  const range = document.createRange();
  range.selectNodeContents(el);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);

  try {
    document.execCommand('copy');
  } catch (err) {
    console.error('Copy failed:', err);
  }
}

function generateEmail() {
  const yourName = document.getElementById('yourName').value.trim();
  const orgName = document.getElementById('orgName').value.trim();
  const phoneDropdown = document.getElementById('phone');
  const phone = phoneDropdown.value === 'add-new'
    ? document.getElementById('newPhone').value.trim()
    : phoneDropdown.value.trim();
  const notOnYP = document.getElementById('notOnYP').checked;

  const linkInputs = document.querySelectorAll('.orgLink');
  const links = Array.from(linkInputs)
    .map(input => input.value.trim())
    .filter(link => link !== '');

  // 🛠️ Updated Validation:
  if (!yourName || !orgName || !phone || (!notOnYP && links.length === 0)) {
    alert('Please complete all required fields.');
    return;
  }

  const subject = `Question about services at ${orgName}`;
  let body;

  if (notOnYP) {
    body = `Hello ${orgName} Team,

This is ${yourName} from Streetlives, a nonprofit publishing the NYC social services map at yourpeer.nyc. We’re currently trying to verify whether ${orgName} is a good fit for inclusion.

We’re focusing on walk-in accessible services or those that allow direct enrollment without a referral.

Would you be open to a quick call? My number is <a href="tel:${phone.replace(/\D/g, '')}">${formatPhone(phone)}</a>. I’m happy to visit in person if helpful.

Warmly,
${yourName}`;
  } else {
    const linksHTML = links.map(link => {
      if (link.includes('yourpeer.nyc')) {
        return `<a href="${link}">${link.replace(/^https?:\/\//, '')}</a>`;
      } else {
        return `<a href="${link}" target="_blank" rel="noopener noreferrer">${link}</a>`;
      }
    }).join(', ');

    body = `Hello ${orgName} Team,

This is ${yourName} here over at Streetlives, a technology non-profit publishing the map of NYC with social services on it at yourpeer.nyc. We have an international team of diverse genders, races, and sexual orientations. We serve the community by providing accurate information on social services across the city.

I want to add ${orgName} to our map and share it with the community. I am adding the locations with a reception where potential clients can walk in and inquire about services or make an appointment, or at least services that allow clients to enroll without being referred. Please view my publication about your location at ${linksHTML} and let me know if it looks accurate.

I am also including our flyer for you to share with your participants. We have over 2,400+ social services organizations published across the NYC Metro Area, professionally curated foreign language versions, and content regularly peer-reviewed and updated by lived experts of homelessness, legal, and immigration involvement.

I am open to setting up a call and happy to make a site visit. My phone number is <a href="tel:${phone.replace(/\D/g, '')}">${formatPhone(phone)}</a>.`;
  }

  document.getElementById('subjectOutput').innerText = subject;
  body = body.replace(/Streetlives/g, 'Streetlives (https://streetlives.nyc)');
  body = body.replace(/yourpeer.nyc/g, 'yourpeer.nyc (https://yourpeer.nyc)');

  document.getElementById('bodyOutput').innerText = body;

}
