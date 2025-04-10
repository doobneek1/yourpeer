function generateEmail() {
  const yourName = document.getElementById('yourName').value.trim();
  const orgName = document.getElementById('orgName').value.trim();
  const orgLink = document.getElementById('orgLink').value.trim();
  const phoneNumber = document.getElementById('phoneNumber').value.trim();
  const templateType = document.getElementById('templateType').value;

  const standardizedPhone = phoneNumber.replace(/\D/g, ''); // Remove non-digits
  const phoneLink = `<a href="tel:${standardizedPhone}">${standardizedPhone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')}</a>`;

  const subject = `Question about services at ${orgName}`;

  const body = `
Hello ${orgName} Team,

This is ${yourName} here over at Streetlives, a technology non-profit publishing the map of NYC with social services on it at <a href="https://yourpeer.nyc" target="_blank">yourpeer.nyc</a>. We have an international team of diverse genders, races, and sexual orientations. We serve the community by providing accurate information on social services across the city.

I want to add ${orgName} to our map and share it with the community. I am adding the locations with a reception where potential clients can walk in and inquire about services or make an appointment, or at least services that allow clients to enroll without being referred. Please view my publication about your location at <a href="${orgLink}" target="_blank">${orgLink}</a> and let me know if it looks accurate.

I am also including our flyer for you to share with your participants. We have over 2,400+ social services organizations published across the NYC Metro Area, professionally curated foreign language versions, and content regularly peer-reviewed and updated by lived experts of homelessness, legal, and immigration involvement. I am open to setting up a call and happy to make a site visit. My phone number is ${phoneLink}.
`;

  document.getElementById('emailOutput').innerHTML = `<strong>Subject:</strong> ${subject}<br><br><strong>Body:</strong><br>${body}`;
}
