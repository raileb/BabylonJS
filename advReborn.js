fetch('advantages2.txt').then(response => response.json()).then(adv => {
    let newAdv = [];
    
    adv.forEach(hero => {
         newAdv.push(hero.data.heroStats.heroVsHeroMatchup.advantage[0])
     });

     const element = document.createElement("a");
     const file = new Blob([JSON.stringify(newAdv)], {
       type: "text/plain",
     });
     element.href = URL.createObjectURL(file);
     element.download = "advantages.txt";
     document.body.appendChild(element);
     element.click();
})