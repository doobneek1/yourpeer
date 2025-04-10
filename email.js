// email.js

// --- Example data for dropdowns ---
const names = ['Alex', 'Jordan', 'Sam'];
const phones = ['(123) 456-7890', '(987) 654-3210'];
const organizations = ['Ali Forney Center', 'Safe Horizon', 'Covenant House', 'Callen-Lorde'];

// Populate name dropdown
const nameSelect = document.getElementById('yourName');
names.forEach(name => {
  const option = document.createElement('option');
  option.value = name;
  option.textContent = name;
  nameSelect.appendChild(option);
});

// Populate phone dropdown
const phoneSelect = document.getElementById('phone');
phones.forEach(phone => {
  const option = document.createElement('option');
  option.value = phone;
  option.textContent = phone;
  phoneSelect.appendChild(option);
});

// Autocomplete organization
const orgDatalist = document.getElementById('orgList');
organizations.forEach(org => {
  const option = document.createElement('option');
  option.value = org;
  orgDatalist.appendChild(option);
});

// --- Manage link fields ---
function addNewLinkField() {
  const container = document.getElementById('linksContainer');
  const inputs = container.querySelectorAll('input');
  const lastInput = inputs[inputs.length - 1];

  if (lastInput.value.trim() !== '') {
    const newInput = document.createElement('input');
    newInput.type = 'text';
    newInput.className = 'orgLink';
    newInput.placeholder = 'Paste another link...';
    newInput.oninput = addNewLinkField;
    container.appendChild(newInput);
  }
}

function toggleNotOnYourPeer() {
  const linksContainer = document.getElementById('linksContainer');
  const linkInputs = linksContainer.querySelectorAll('.orgLink');
  linkInputs.forEach(input => input.disabled = true);
  document.getElementById('notOnYPButton').style.display = 'none';
  document.getElementById('notOnYPFlag').value = 'true';
}

function enableLinksAgain() {
  const linksContainer = document.getElementById('linksContainer');
  const linkInputs = linksContainer.querySelectorAll('.orgLink');
  linkInputs.forEach(input => input.disabled = false);
  document.getElementById('notOnYPButton').style.display = 'inline-block';
  document.getElementById('notOnYPFlag').value = 'false';
}

function generateEmail() {
  const yourName = document.getElementById('yourName').value.trim();
  const orgName = document.getElementById('orgName').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const notOnYourPeer = document.getElementById('notOnYPFlag').value === 'true';

  const linkInputs = document.querySelectorAll('.orgLink');
  const links = Array.from(linkInputs)
    .map(input => input.value.trim())
    .filter(link => link !== '');

  const linksHTML = links.map(link => {
    if (link.includes('yourpeer.nyc')) {
      return `<a href="${link}">${link}</a>`;
    } else {
      return `<a href="${link}" target="_blank" rel="noopener noreferrer">${link}</a>`;
    }
  }).join(', ');

  const phoneHTML = `<a href="tel:${phone.replace(/\D/g, '')}">${phone}</a>`;

  if (!yourName || !orgName || (!notOnYourPeer && links.length === 0) || !phone) {
    alert('Please fill in all fields.');
    return;
  }

  const subject = `Question about services at ${orgName}`;

  let body = '';

  if (notOnYourPeer) {
    body = `Hello ${orgName} Team,

This is ${yourName} here over at Streetlives, a technology non-profit publishing the map of NYC with social services on it at yourpeer.nyc. We serve the community by providing accurate, peer-reviewed information.

We would love to add ${orgName} to our map to help more New Yorkers access your services. If you are interested, please let us know!

I am happy to set up a call or visit in person. My phone number is ${phoneHTML}.
`;
  } else {
    body = `Hello ${orgName} Team,

This is ${yourName} here over at Streetlives, a technology non-profit publishing the map of NYC with social services on it at yourpeer.nyc.

I want to add ${orgName} to our map and share it with the community. Please view my publication about your location at ${linksHTML} and let me know if it looks accurate.

I am happy to set up a call or visit in person. My phone number is ${phoneHTML}.
`;
  }

  document.getElementById('subjectOutput').innerHTML = subject;
  document.getElementById('bodyOutput').innerHTML = body;
}

function copyText(id) {
  const text = document.getElementById(id).innerText;
  navigator.clipboard.writeText(text).then(() => {
    alert('Copied!');
  });
}

// Return to formatter
function returnToFormatter() {
  window.location.href = 'index.html'; // adjust path if needed
}

// Enable link typing if any link input changes
const linksContainer = document.getElementById('linksContainer');
linksContainer.addEventListener('input', () => {
  enableLinksAgain();
});
