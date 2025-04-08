function formatTimeRange(text) {
  return text.replace(/(\d{1,4}[ap])-(\d{1,4}[ap])/gi, (_, start, end) => {
    const parseTime = (t) => {
      let period = t.includes('a') ? 'AM' : 'PM';
      t = t.replace(/[ap]/i, '');

      let hours, minutes;

      if (t.length <= 2) {
        hours = parseInt(t);
        minutes = 0;
      } else {
        if (t.length === 3) {
          hours = parseInt(t[0]);
          minutes = parseInt(t.slice(1));
        } else {
          hours = parseInt(t.slice(0, 2));
          minutes = parseInt(t.slice(2));
        }
      }

      if (isNaN(minutes)) minutes = 0;

      if (period === 'PM' && hours !== 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;

      return new Date(0, 0, 0, hours, minutes);
    };

    let startTime = parseTime(start);
    let endTime = parseTime(end);

    let startFormatted = startTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    let endFormatted = endTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

    let nextDay = endTime < startTime ? "⁺¹" : "";
    return `${startFormatted} — ${endFormatted}${nextDay}`;
  });
}


function formatAge(text) {
  return text.replace(/age\((.+?)\)/gi, (_, ages) => {
    let nums = ages.split(/[-,]/).map(Number);
    if (nums.length === 2) {
      return `Age requirement: ${nums[0]}-${nums[1]} (until your ${nums[1] + 1}th birthday)`;
    } else {
      return `Age requirement: ${nums[0]}+`;
    }
  });
}
function copyTextArea() {
  const textArea = document.getElementById('inputText');
  const copyButton = document.getElementById('copyButton');

  // Select the text
  textArea.select();
  textArea.setSelectionRange(0, 99999); // for mobile devices

  // Try clipboard API
  if (navigator.clipboard) {
    navigator.clipboard.writeText(textArea.value)
      .then(() => {
        copyButton.innerText = 'Copied!';
        setTimeout(() => {
          copyButton.innerText = 'Copy Text';
        }, 2000);
      })
      .catch(err => {
        console.error('Clipboard API failed, trying execCommand...', err);
        fallbackCopy();
      });
  } else {
    fallbackCopy();
  }

  function fallbackCopy() {
    const successful = document.execCommand('copy');
    if (successful) {
      copyButton.innerText = 'Copied!';
      setTimeout(() => {
        copyButton.innerText = 'Copy Text';
      }, 2000);
    } else {
      console.error('Fallback copy failed.');
    }
  }
}




function safeHyperlink(text) {
  const parts = text.split(/(<a .*?>.*?<\/a>)/g);
  let output = [];

  for (let part of parts) {
    if (part.startsWith('<a ')) {
      output.push(part);
    } else {
      // Custom phone with display
      part = part.replace(/(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})\|\(([^)]+)\)/g, (m, num, label) => {
        let clean = num.replace(/\D/g, '');
        return `<a href="tel:${clean}">${label}</a>`;
      });

      // Custom email with display
      part = part.replace(/([\w\.-]+@[\w\.-]+\.\w+)\|\(([^)]+)\)/g, (m, email, label) => {
        return `<a href="mailto:${email}">${label}</a>`;
      });

      // Custom URL with display
      part = part.replace(/(https?:\/\/[^\s<>\|]+)\|\(([^)]+)\)/g, (m, url, label) => {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`;
      });

      // Raw email
      part = part.replace(/(?<!href="mailto:)([\w\.-]+@[\w\.-]+\.\w+)/g, (m, email) => {
        return `<a href="mailto:${email}">${email}</a>`;
      });

      // Raw phone
      part = part.replace(/(?<!href="tel:)(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})(?:[,xX]\s*(\d+))?/g, (m, num, ext) => {
        let clean = num.replace(/\D/g, '');
        let formatted = `(${clean.slice(0, 3)}) ${clean.slice(3, 6)}-${clean.slice(6)}`;
        if (ext) {
          return `<a href="tel:${clean},${ext}">${formatted} x${ext}</a>`;
        } else {
          return `<a href="tel:${clean}">${formatted}</a>`;
        }
      });

      // Raw URL
      part = part.replace(/(?<!href=")(https?:\/\/[^\s<>\|)]+)/g, (m, url) => {
        let display = url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
        return `<a href="${url}" target="_blank" rel="noopener noreferrer">${display}</a>`;
      });

      output.push(part);
    }
  }

  let finalText = output.join('');
  finalText = finalText.replace(/(?<!^)(?<!<br>)•/g, '<br>•');
  return finalText;
}


function processText(input) {
  let lines = input.split('\n');
  let output = [];

  let previousWasEmpty = false;

  lines.forEach((line, index) => {
    line = line.trim();

    if (!line) {
      previousWasEmpty = true;
      return; // skip empty lines completely
    }

    const isFirstLine = output.length === 0;
    const endsWithColon = line.endsWith(':');
    const alreadyFormatted = line.startsWith('•') || line.startsWith('<br>') || line.startsWith('<br>&emsp;—');

    // Insert <br> if there was an empty line before
    if (previousWasEmpty && !isFirstLine) {
      line = '<br>' + line;
    }
    previousWasEmpty = false; // reset the flag

    // Add bullets and dashes
    if (!alreadyFormatted && !(isFirstLine && endsWithColon)) {
      if (line.startsWith('-')) {
        line = line.replace(/^-\s*/, '');
        line = `<br>&emsp;— ${line}`;
      } else if (!line.startsWith('<br>')) {
        line = `• ${line}`;
      }
    }

    line = formatTimeRange(line);
    line = formatAge(line);
    line = safeHyperlink(line);

    output.push(line);
  });

  return output.join('\n');
}




function convert() {
  const textArea = document.getElementById("inputText");
  const rawText = textArea.value.trim();

  if (!rawText) return;

  const formatted = processText(rawText);

  // 🛠️ 1. KEEP the input text clean (no <br>)
  textArea.value = formatted;

  // 🛠️ 2. ONLY modify the output rendering
  document.getElementById("output").innerHTML = formatted.replace(/•/g, '<br>•');
}



function refresh() {
  document.getElementById('inputText').value = "";
  document.getElementById('output').innerHTML = "";
}
document.getElementById("inputText").addEventListener("keydown", function(event) {
  if (event.ctrlKey && event.key === "Enter") {
    event.preventDefault();
    convert();
  }
});
const textArea = document.getElementById('inputText');
const copyButton = document.getElementById('copyButton');

// Listen to typing inside the textarea
textArea.addEventListener('input', function () {
  if (textArea.value.trim().length > 0) {
    copyButton.style.display = 'inline-block'; // show
  } else {
    copyButton.style.display = 'none'; // hide
  }
});

// Also initially hide the button
copyButton.style.display = 'none';

function addServicesInclude() {
  const textArea = document.getElementById('inputText');
  if (!textArea.value.startsWith('Services include:')) {
    textArea.value = `Services include:\n\n` + textArea.value.trim();
  }
}

function appendMetrocards() {
  const textArea = document.getElementById('inputText');
  const statement = "\n\n• Medicaid recipients may be eligible for discounted MetroCards.";
  textArea.value = textArea.value.trim() + statement;
}

function appendRisks() {
  const textArea = document.getElementById('inputText');
  const statement = "\n\n• Non-citizens should seek legal advice before applying for benefits, as it may affect their immigration status.";
  textArea.value = textArea.value.trim() + statement;
}
