const link = document.querySelector(".link");

// Enter Your Gemini 2.0 Api Key
const apiKey = "AIzaSyBwoiF-DUPqk767Kn4Pn0JJRic1YTTrQxk";

const aiLink = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
const button = document.querySelector(".get-info");
const container = document.querySelector(".container");

const csvData = [
  ["Company Name", "Phone Number", "Email", "Website Link", "Location"],
];

button.addEventListener("click", function () {
  const fetchLink = link.value;
  link.value = "";
  link.placeholder = "Loading..";

  fetch(`http://localhost:3000/fetch-html?url=${encodeURIComponent(fetchLink)}`)
    .then((res) => res.text())
    .then((html) => {
      const requestBody = {
        contents: [
          {
            parts: [
              {
                text: `Here is HTML code: ${html}; There is "Contact Information" section and you need to get me phone number, email, site link and location; Output format: "companyName;number;email;link;location"`,
              },
            ],
          },
        ],
      };

      fetch(aiLink, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })
        .then((response) => response.json())
        .then((data) => {
          link.placeholder = "Enter link here";

          const text = data.candidates[0].content.parts[0].text;
          const array = text.split(";");

          csvData.push(array);
          const csv = csvData.map((row) => row.join(",")).join("\n");

          const downloadLink = document.createElement("a");
          downloadLink.textContent = "Download Contact Info as CSV File";
          downloadLink.classList.add("m-2");
          downloadLink.style.cursor = "pointer";
          downloadLink.style.textDecoration = "underline";

          const blob = new Blob([csv], { type: "text/csv" });
          const url = URL.createObjectURL(blob);

          downloadLink.href = url;
          downloadLink.download = "contact-info.csv";

          container.appendChild(downloadLink);
        });
    });
});
