
let inputHistory = []; // 🆕 store previous versions

const textArea = document.getElementById('inputText');
const copyButton = document.getElementById('copyButton');

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

function safeHyperlink(text) {
  const parts = text.split(/(<a .*?>.*?<\/a>)/g);
  let output = [];

  for (let part of parts) {
    if (part.startsWith('<a ')) {
      output.push(part);
    } else {
      part = part.replace(/(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})\|\(([^)]+)\)/g, (m, num, label) => {
        let clean = num.replace(/\D/g, '');
        return `<a href="tel:${clean}">${label}</a>`;
      });

      part = part.replace(/([\w\.-]+@[\w\.-]+\.\w+)\|\(([^)]+)\)/g, (m, email, label) => {
        return `<a href="mailto:${email}">${label}</a>`;
      });

      part = part.replace(/(https?:\/\/[^\s<>\|]+)\|\(([^)]+)\)/g, (m, url, label) => {
        if (url.includes('yourpeer.nyc')) {
          return `<a href="${url}">${label}</a>`;
        } else {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`;
        }
      });

      part = part.replace(/(?<!href="mailto:)([\w\.-]+@[\w\.-]+\.\w+)/g, (m, email) => {
        return `<a href="mailto:${email}">${email}</a>`;
      });

      part = part.replace(/(?<!href="tel:)(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})(?:[,xX]\s*(\d+))?/g, (m, num, ext) => {
        let clean = num.replace(/\D/g, '');
        let formatted = `(${clean.slice(0, 3)}) ${clean.slice(3, 6)}-${clean.slice(6)}`;
        return ext ? `<a href="tel:${clean},${ext}">${formatted} x${ext}</a>` : `<a href="tel:${clean}">${formatted}</a>`;
      });

      part = part.replace(/(?<!href=")(https?:\/\/[^\s<>\|)]+)/g, (url) => {
        let display = url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
        if (url.includes('yourpeer.nyc')) {
          return `<a href="${url}">${display}</a>`;
        } else {
          return `<a href="${url}" target="_blank" rel="noopener noreferrer">${display}</a>`;
        }
      });

      output.push(part);
    }
  }

  let finalText = output.join('');
  return finalText.replace(/(?<!^)(?<!<br>)•/g, '<br>•');
}

function processText(input) {
  let lines = input.split('\n');
  let output = [];
  let previousWasEmpty = false;

  lines.forEach((line) => {
    line = line.trim();
    if (!line) {
      previousWasEmpty = true;
      return;
    }

    const isFirstLine = output.length === 0;
    const endsWithColon = line.endsWith(':');
    const alreadyFormatted = line.startsWith('•') || line.startsWith('<br>') || line.startsWith('<br>&emsp;—');

    if (previousWasEmpty && !isFirstLine) {
      line = '<br>' + line;
    }
    previousWasEmpty = false;

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
  const rawText = textArea.value.trim();
  if (!rawText) return;

  inputHistory.push(rawText);
  const formatted = processText(rawText);

  textArea.value = formatted;
  document.getElementById("output").innerHTML = formatted.replace(/•/g, '<br>•');
  updateCancelButton();
}

function cancelChanges() {
  if (inputHistory.length > 1) {
    inputHistory.pop();
    textArea.value = inputHistory[inputHistory.length - 1];
    document.getElementById('output').innerHTML = '';
  } else {
    textArea.value = '';
    document.getElementById('output').innerHTML = '';
  }

  if (textArea.value.trim() === '') {
    copyButton.style.display = 'none';
  }
  updateCancelButton();
}

function refresh() {
  textArea.value = '';
  document.getElementById('output').innerHTML = '';
  inputHistory = [];
  updateCancelButton();
  copyButton.style.display = 'none';
}

function copyTextArea() {
  textArea.select();
  textArea.setSelectionRange(0, 99999);

  if (navigator.clipboard) {
    navigator.clipboard.writeText(textArea.value)
      .then(() => {
        copyButton.innerText = 'Copied!';
        setTimeout(() => {
          copyButton.innerText = 'Copy Text';
        }, 2000);
      })
      .catch(err => {
        console.error('Clipboard API failed:', err);
      });
  }
}

textArea.addEventListener('input', function () {
  if (textArea.value.trim() !== '') {
    copyButton.style.display = 'inline-block';
  } else {
    copyButton.style.display = 'none';
  }
  inputHistory.push(textArea.value);
  updateCancelButton();
});

copyButton.style.display = 'none';

function addServicesInclude() {
  if (!textArea.value.startsWith('Services include:')) {
    textArea.value = `Services include:\n` + textArea.value.trim();
  }
  inputHistory.push(textArea.value);
  updateCancelButton();
  textArea.focus();
}

function appendMetrocards() {
  const statement = "\n• If you are a Medicaid or Medicare recipient, see if you qualify for a Round-Trip MetroCard upon your visit.";
  textArea.value = textArea.value.trim() + statement;
  inputHistory.push(textArea.value);
  updateCancelButton();
  textArea.focus();
}

function appendRisks() {
  const statement = '\n• If you are a non-citizen with a criminal record, please <a href="https://docs.google.com/document/d/e/2PACX-1vQ-cQznO83jSMzdwQoOOZMO22gOesH8YgiSo3GTzuRpHjMczqzzFz8JR23pM6_ZMG8khiGazWIcF-jA/pub" target="_blank" rel="noopener noreferrer">see if you might be at risk of deportation</a>.';
  textArea.value = textArea.value.trim() + statement;
  inputHistory.push(textArea.value);
  updateCancelButton();
  textArea.focus();
}

function appendInelig() {
  const statement = '\n• If you are a non-citizen, please <a href="https://docs.google.com/document/d/e/2PACX-1vSRz4FT0ndCbqt63vO1Dq5Isj7FS4TZjw5NMc0gn8HCSg2gLx-MXD56X8Z56IDD5qbLX2_xzpwCqHaK/pub" target="_blank" rel="noopener noreferrer">see if you might qualify for this service</a>.';
  textArea.value = textArea.value.trim() + statement;
  inputHistory.push(textArea.value);
  updateCancelButton();
  textArea.focus();
}

function appendSurviv() {
  const statement = '\n• If you are a non-citizen and survived a crime, please <a href="https://docs.google.com/document/d/e/2PACX-1vSRz4FT0ndCbqt63vO1Dq5Isj7FS4TZjw5NMc0gn8HCSg2gLx-MXD56X8Z56IDD5qbLX2_xzpwCqHaK/pub" target="_blank" rel="noopener noreferrer">see if you might qualify for some immigration benefits</a>.';
  textArea.value = textArea.value.trim() + statement;
  inputHistory.push(textArea.value);
  updateCancelButton();
  textArea.focus();
}

function updateCancelButton() {
  const cancelButton = document.getElementById('cancelButton');
  if (cancelButton) {
    cancelButton.style.display = inputHistory.length > 1 ? 'inline-block' : 'none';
  }
}

// Hotkey for Ctrl+Enter = Convert
textArea.addEventListener('keydown', function (event) {
  if (event.ctrlKey && event.key === 'Enter') {
    event.preventDefault();
    convert();
  }
});
