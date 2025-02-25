const links = ["../home/index.html", "../lightningTalks/lightningTalks.html", "../experiences/experiences.html", "https://github.com/ZacharyMThornton"];

const linkButtons = document.getElementsByClassName("link");

for (let i=0; i <= linkButtons.length - 1; i++){
    linkButtons[i].addEventListener("click", () => {
        window.location.replace(links[i]);
    })
}