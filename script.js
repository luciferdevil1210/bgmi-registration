const form = document.getElementById("registrationForm");

const previewTeam = document.getElementById("previewTeam");
const previewIgl = document.getElementById("previewIgl");
const previewBgmi = document.getElementById("previewBgmi");
const previewPhone = document.getElementById("previewPhone");
const previewCity = document.getElementById("previewCity");
const previewMode = document.getElementById("previewMode");

function updatePreview(){
previewTeam.innerText = form.teamName.value || "-";
previewIgl.innerText = form.iglName.value || "-";
previewBgmi.innerText = form.bgmiId.value || "-";
previewPhone.innerText = form.whatsapp.value || "-";
previewCity.innerText = form.city.value || "-";
previewMode.innerText = form.matchType.value || "-";
}

form.querySelectorAll("input, select").forEach(field=>{
field.addEventListener("input", updatePreview);
});

form.addEventListener("submit", function(e){
e.preventDefault();

const team = form.teamName.value;
const igl = form.iglName.value;
const bgmi = form.bgmiId.value;
const email = form.email.value;
const phone = form.whatsapp.value;
const city = form.city.value;
const mode = form.matchType.value;

const ownerNumber = "918856984314";
const reveals = document.querySelectorAll("section");

function revealOnScroll() {
reveals.forEach(section => {
const windowHeight = window.innerHeight;
const elementTop = section.getBoundingClientRect().top;
if (elementTop < windowHeight - 100) {
section.classList.add("reveal", "active");
}
});
}

window.addEventListener("scroll", revealOnScroll);
revealOnScroll();
const message = `
🏆 New BGMI Registration

Team: ${team}
IGL: ${igl}
BGMI ID: ${bgmi}
Email: ${email}
WhatsApp: ${phone}
Location: ${city}
Mode: ${mode}
`;

const whatsappURL = `https://wa.me/${ownerNumber}?text=${encodeURIComponent(message)}`;

window.open(whatsappURL, "_blank");

alert("Registration successful! Data sent to owner.");

form.reset();
updatePreview();
});