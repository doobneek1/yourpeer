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

function safeHyperlink(text) {
  const parts = text.split(/(<a .*?>.*?<\/a>)/g);
  let output = [];

  for (let part of parts) {
    if (part.startsWith('<a ')) {
      output.push(part);
    } else {
      // your current hyperlinking rules: phone, email, custom labels, etc.
      // (your code remains here)
      output.push(part);
    }
  }

  let finalText = output.join('');

  // 🧠 Final pass to hyperlink missed domains
  finalText = finalText.replace(
    /(?<!href="[^"]*")\b([\w.-]+\.[a-z]{2,}(\/[^\s<>]*)?)/gi,
    (match, url) => {
      if (url.includes('yourpeer.nyc')) {
        return `<a href="https://${url}" rel="noopener noreferrer">${url}</a>`;
      }
      return `<a href="https://${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
    }
  );

  // 📌 Make sure every bullet starts on a new line (your existing code)
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
