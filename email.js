function autoLink(text) {
  text = text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
  text = text.replace(/(\(\d{3}\)\s*\d{3}-\d{4})/g, '<a href="tel:$1">$1</a>');
  return text;
}
function addNewLinkField() {
  const container = document.getElementById('linksContainer');
  const inputs = container.querySelectorAll('input');

  // Check the last input
  const lastInput = inputs[inputs.length - 1];

  if (lastInput.value.trim() !== '') {
    // If last input has text, add a new empty input
    const newInput = document.createElement('input');
    newInput.type = 'text';
    newInput.className = 'orgLink';
    newInput.placeholder = 'Paste another link...';
    newInput.oninput = addNewLinkField; // recursive binding
    container.appendChild(newInput);
  }
}

function generateEmail() {
  const yourName = document.getElementById('yourName').value.trim();
  const orgName = document.getElementById('orgName').value.trim();
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

  const phone = document.getElementById('phone').value.trim();
  const phoneHTML = `<a href="tel:${phone.replace(/\D/g, '')}">${phone}</a>`;

  if (!yourName || !orgName || links.length === 0 || !phone) {
    alert('Please fill in all fields.');
    return;
  }

  const subject = `Question about services at ${orgName}`;

  const body = `Hello ${orgName} Team,

This is ${yourName} here over at Streetlives, a technology non-profit publishing the map of NYC with social services on it at yourpeer.nyc. We have an international team of diverse genders, races, and sexual orientations. We serve the community by providing accurate information on social services across the city.

I want to add ${orgName} to our map and share it with the community. I am adding the locations with a reception where potential clients can walk in and inquire about services or make an appointment, or at least services that allow clients to enroll without being referred. Please view my publication about your location at ${linksHTML} and let me know if it looks accurate.

I am also including our flyer for you to share with your participants. We have over 2,400+ social services organizations published across the NYC Metro Area, professionally curated foreign language versions, and content regularly peer-reviewed and updated by lived experts of homelessness, legal, and immigration involvement.

I am open to setting up a call and happy to make a site visit. My phone number is ${phoneHTML}.
`;

  document.getElementById('subjectOutput').innerHTML = subject;  // 🛠 use innerHTML
  document.getElementById('bodyOutput').innerHTML = body;        // 🛠 use innerHTML
}


function formatPhone(phone) {
  const clean = phone.replace(/\D/g, '');
  if (clean.length === 10) {
    return `(${clean.slice(0, 3)}) ${clean.slice(3, 6)}-${clean.slice(6)}`;
  } else {
    return phone;
  }
}
