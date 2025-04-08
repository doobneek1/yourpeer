// function formatTimeRange(text) {
//   return text.replace(/(\d{1,4}[ap])-(\d{1,4}[ap])/gi, (_, start, end) => {
//     const parseTime = (t) => {
//       let period = t.includes('a') ? 'AM' : 'PM';
//       t = t.replace(/[ap]/i, '');
//       let hours = parseInt(t.length > 2 ? t.slice(0, 2) : t[0]);
//       let minutes = parseInt(t.length > 2 ? t.slice(2) : 0);
//       if (period === 'PM' && hours !== 12) hours += 12;
//       if (period === 'AM' && hours === 12) hours = 0;
//       return new Date(0, 0, 0, hours, minutes);
//     };
//     let startTime = parseTime(start);
//     let endTime = parseTime(end);
//     let startFormatted = startTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
//     let endFormatted = endTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
//     let nextDay = endTime < startTime ? "⁺¹" : "";
//     return `${startFormatted} — ${endFormatted}${nextDay}`;
//   });
// }

// function formatAge(text) {
//   return text.replace(/age\((.+?)\)/gi, (_, ages) => {
//     let nums = ages.split(/[-,]/).map(Number);
//     if (nums.length === 2) {
//       return `Age requirement: ${nums[0]}-${nums[1]} (until your ${nums[1] + 1}th birthday)`;
//     } else {
//       return `Age requirement: ${nums[0]}+`;
//     }
//   });
// }

// function safeHyperlink(text) {
//   const parts = text.split(/(<a .*?>.*?<\/a>)/g);
//   let output = [];

//   for (let part of parts) {
//     if (part.startsWith('<a ')) {
//       output.push(part);  // already hyperlinked part
//     } else {
//       // Custom phone with display
//       part = part.replace(/(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})\|\(([^)]+)\)/g, (m, num, label) => {
//         let clean = num.replace(/\D/g, '');
//         return `<a href="tel:${clean}">${label}</a>`;
//       });

//       // Custom email with display
//       part = part.replace(/([\w\.-]+@[\w\.-]+\.\w+)\|\(([^)]+)\)/g, (m, email, label) => {
//         return `<a href="mailto:${email}">${label}</a>`;
//       });

//       // Custom URL with display
//       part = part.replace(/(https?:\/\/[^\s<>\|]+)\|\(([^)]+)\)/g, (m, url, label) => {
//         return `<a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`;
//       });

//       // Raw email
//       part = part.replace(/(?<!href="mailto:)([\w\.-]+@[\w\.-]+\.\w+)/g, (m, email) => {
//         return `<a href="mailto:${email}">${email}</a>`;
//       });

//       // Raw phone
//       part = part.replace(/(?<!href="tel:)(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})(?:[,xX]\s*(\d+))?/g, (m, num, ext) => {
//         let clean = num.replace(/\D/g, '');
//         let formatted = `(${clean.slice(0, 3)}) ${clean.slice(3, 6)}-${clean.slice(6)}`;
//         if (ext) {
//           return `<a href="tel:${clean},${ext}">${formatted} x${ext}</a>`;
//         } else {
//           return `<a href="tel:${clean}">${formatted}</a>`;
//         }
//       });

//       // Raw full URL (http/https)
//       part = part.replace(/(?<!href=")(https?:\/\/[^\s<>\|)]+)/g, (m, url) => {
//         let display = url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
//         return `<a href="${url}" target="_blank" rel="noopener noreferrer">${display}</a>`;
//       });

//       output.push(part);
//     }
//   }

//   let finalText = output.join('');

//   // ➡️ Final Smart Hyperlinking: domains without http/https
//   finalText = finalText.replace(
//     /(?<!href="[^"]*")(?<!<a[^>]*>)([a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/[^\s<>]*)?)/g,
//     (match, url) => {
//       if (url.includes('yourpeer.nyc')) {
//         return `<a href="https://${url}" rel="noopener noreferrer">${url}</a>`;
//       }
//       return `<a href="https://${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
//     }
//   );

//   // 📌 Add <br> visually before bullets
//   finalText = finalText.replace(/(?<!^)(?<!<br>)•/g, '<br>•');

//   return finalText;
// }


// function processText(input) {
//   let lines = input.split('\n');
//   let output = [];

//   let previousWasEmpty = false;

//   lines.forEach((line, index) => {
//     line = line.trim();

//     if (!line) {
//       previousWasEmpty = true;
//       return; // skip empty lines completely
//     }

//     const isFirstLine = output.length === 0;
//     const endsWithColon = line.endsWith(':');
//     const alreadyFormatted = line.startsWith('•') || line.startsWith('<br>') || line.startsWith('<br>&emsp;—');

//     // Insert <br> if there was an empty line before
//     if (previousWasEmpty && !isFirstLine) {
//       line = '<br>' + line;
//     }
//     previousWasEmpty = false; // reset the flag

//     // Add bullets and dashes
//     if (!alreadyFormatted && !(isFirstLine && endsWithColon)) {
//       if (line.startsWith('-')) {
//         line = line.replace(/^-\s*/, '');
//         line = `<br>&emsp;— ${line}`;
//       } else if (!line.startsWith('<br>')) {
//         line = `• ${line}`;
//       }
//     }

//     line = formatTimeRange(line);
//     line = formatAge(line);
//     line = safeHyperlink(line);

//     output.push(line);
//   });

//   return output.join('\n');
// }



// function convert() {
//   const textArea = document.getElementById("inputText");
//   const rawText = textArea.value.trim();

//   if (!rawText) return;

//   const formatted = processText(rawText);

//   // 🛠️ 1. KEEP the input text clean (no <br>)
//   textArea.value = formatted;

//   // 🛠️ 2. ONLY modify the output rendering
//   document.getElementById("output").innerHTML = formatted.replace(/•/g, '<br>•');
// }



// function refresh() {
//   document.getElementById('inputText').value = "";
//   document.getElementById('output').innerHTML = "";
// }
// document.getElementById("inputText").addEventListener("keydown", function(event) {
//   if (event.ctrlKey && event.key === "Enter") {
//     event.preventDefault();
//     convert();
//   }
// });
function formatTimeRange(text) {
  return text.replace(/(\d{1,4}[ap])-(\d{1,4}[ap])/gi, (_, start, end) => {
    const parseTime = (t) => {
      let period = t.includes('a') ? 'AM' : 'PM';
      t = t.replace(/[ap]/i, '');
      let hours = parseInt(t.length > 2 ? t.slice(0, 2) : t[0]);
      let minutes = parseInt(t.length > 2 ? t.slice(2) : 0);
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

// 🛡️ Protect already hyperlinked text and hyperlink only safe parts
function protectAndHyperlink(text) {
  const parts = text.split(/(<a .*?>.*?<\/a>)/g);
  const output = [];

  for (let part of parts) {
    if (part.startsWith('<a ')) {
      output.push(part); // already hyperlinked
    } else {
      // Raw domains (without http)
      part = part.replace(/\b(?!https?:\/\/)([a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/[^\s<>]*)?)/g, (domain) => {
        if (domain.includes('yourpeer.nyc')) {
          return `<a href="https://${domain}">${domain}</a>`;
        } else {
          return `<a href="https://${domain}" target="_blank" rel="noopener noreferrer">${domain}</a>`;
        }
      });

      // Raw URLs with http/https
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

  return output.join('');
}

function processText(input) {
  let lines = input.split('\n');
  let output = [];

  lines.forEach((line, index) => {
    line = line.trim();
    if (!line) return; // ignore empty lines

    const isFirstLine = index === 0;
    const endsWithColon = line.endsWith(':');
    const alreadyBullet = line.startsWith('•') || line.startsWith('<br>&emsp;—') || line.startsWith('<br>');

    if (!alreadyBullet && !(isFirstLine && endsWithColon)) {
      if (line.startsWith('-')) {
        line = line.replace(/^-\s*/, '');
        line = `<br>&emsp;— ${line}`;
      } else {
        line = `• ${line}`;
      }
    }

    line = formatTimeRange(line);
    line = formatAge(line);
    line = protectAndHyperlink(line);

    output.push(line);
  });

  return output.join('\n');
}

function convert() {
  const textArea = document.getElementById("inputText");
  let rawText = textArea.value.trim();
  if (!rawText) return;

  // 🛡️ Protect existing links first
  let protectedText = protectAndHyperlink(rawText);

  // 🛠️ Then standardize
  let finalText = processText(protectedText);

  // 🧹 Remove extra empty lines at the start
  finalText = finalText.replace(/^\s*<br>\s*/g, '');

  // Update input and output
  textArea.value = finalText;
  document.getElementById("output").innerHTML = finalText.replace(/•/g, '<br>•');
}

function refresh() {
  document.getElementById('inputText').value = "";
  document.getElementById('output').innerHTML = "";
}

// ➡️ Allow Ctrl + Enter to trigger Convert
document.addEventListener('keydown', function (e) {
  if (e.ctrlKey && e.key === 'Enter') {
    convert();
  }
});
