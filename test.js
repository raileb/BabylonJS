async function build() {
    const picks = [99, 112, 49, 91, 136, 63, 22, 135, 27, 30];
    let statsBox = {};
    const heroIndex = await fetch('heroIndex.txt').then(response => response.json());


    const advantages = await fetch('advantages.txt').then(response => response.json());

    let advData = picks.slice();
    //let advHeroAll = new Array(10).fill(0);
    picks.slice(0, 5).forEach((heroIdRadiant, ind1) => {
        picks.slice(5).forEach((heroIdDire, ind2) => {
            let adv = advantages[heroIndex[heroIdRadiant]].vs.find(x => x.heroId2 === heroIdDire).synergy.toFixed(2)
            advData.push(adv);
            // advHeroAll[ind1] = (parseFloat(advHeroAll[ind1]) + parseFloat(adv)).toFixed(2);
            // advHeroAll[ind2 + 5] = (parseFloat(advHeroAll[ind2 + 5]) + parseFloat(adv)).toFixed(2);
        });
    });
    // advData = advData.concat(advHeroAll);

    let svgW = 1000,
        svgH = 800,
        advLeftPadding = 120,
        advTopPadding = 85,
        margin = 20;

    const svg = d3.select(".advantage")
        .append("svg")
        .attr("width", svgW)
        .attr("height", svgH);
        
    svg.selectAll("image")
        .data(advData)
        .enter()
        .append("svg:image")
        .attr('x', (d, i) => {
            if (i < 10) return (i < 5) ? margin : margin + advLeftPadding + (i - 5) * 110;
            // else if (i > 34) {
            //     return (i < 40) ? margin + advLeftPadding + 5 * 110 + 10: margin + advLeftPadding + (i % 5) * 110;
            // }
            else return margin + advLeftPadding + i % 5 * 110;
        })
        .attr('y', (d, i) => {
            if (i < 10) return (i < 5) ? margin + advTopPadding + i * 85 : margin;
            // else if (i > 34) {
            //     return (i < 40) ? margin + advTopPadding + (i % 5) * 65 : margin + advTopPadding + 5 * 65 + 10;
            // }
            else return margin + advTopPadding + Math.floor((i - 10) / 5) * 85;
        })
        .attr('width', 100)
        .attr('height', 55)
        .attr("xlink:href", (d, i) => {
            if (i < 10) return "HeroIcons/" + d + ".png";
            // else if (i > 34) {
            //     return "HeroIcons/default.png"
            // }
            else {
                let heroWin = (d >= 0) ? Math.floor((i - 10) / 5) : (i - 10) % 5 + 5;
                return "HeroIcons/" + picks[heroWin] + ".png";
            }            
        });
        
        
    svg.selectAll("rect")
        .data(advData)
        .enter()
        .append("rect")        
        .attr('x', (d, i) => {
            if (i < 10) return (i < 5) ? margin : margin + advLeftPadding + (i - 5) * 110;
            // else if (i > 34) {
            //     return (i < 40) ? margin + advLeftPadding + 5 * 110 + 10: margin + advLeftPadding + (i % 5) * 110;
            // }
            else return margin + advLeftPadding + i % 5 * 110;
        })
        .attr('y', (d, i) => {
            if (i < 10) return (i < 5) ? margin + advTopPadding + i * 85 : margin;
            // else if (i > 34) {
            //     return (i < 40) ? margin + advTopPadding + (i % 5) * 65: margin + advTopPadding + 5 * 65 + 10;
            // }
            else return margin + advTopPadding + Math.floor((i - 10) / 5) * 85;
        })
        .attr("rx", 5)
        .attr("ry", 5)
        .attr('width', 100)
        .attr('height', 55)
        .attr("fill", "transparent")
        .attr("stroke", (d, i) => {
            if (i < 10) return (i < 5) ? "#007241" : "#A62F00";
            else return (d >= 0) ? "#007241" : "#A62F00";
        })
        .attr("stroke-width", 2)
        .on("mouseover", (e, d) => {
            let ads = e.target.parentElement.querySelectorAll('rect');
            let ind = 0, hoverRect, hoverImg;
            for (let ds of ads) {
                if (ds === e.target) break
                ind += 1
            }

            function hoverAll(node, cl) {
                svg.selectAll(node).filter((d, i) => {
                    if (ind < 5) {
                        return (ind === Math.floor((i - 10) / 5)) || (ind === i);
                    }
                    if (ind < 10) {
                        return ((i % 5 === ind % 5) && (i > 9)) || (ind === i);
                    }
                    if (i < 5) return (i === Math.floor((ind - 10) / 5));
                    return (Math.floor(i / 5) === Math.floor(ind / 5)) || i % 5 === ind % 5;
                }).attr("class", cl)
            }

            hoverAll('rect', 'hoverAdv');
            hoverAll('image', 'hoverAdv');
            hoverAll('text', 'hoverAdvText');            
        })
        .on("mouseout", (e) => {
            if (e.relatedTarget.tagName !== 'text') {
                svg.selectAll('rect').attr('class', '')
                svg.selectAll('image').attr('class', '')
                svg.selectAll('text').attr('class', '')    
            }
            
        });

    svg.selectAll("text")
        .data(advData)
        .enter()
        .append("text")
        .attr('x', (d, i) => {
            // if (i > 34) {
            //     return (i < 40) ? margin + advLeftPadding + 5 * 110 + 10 + 25: margin + advLeftPadding + (i % 5) * 110 + 25;
            // }
            if (i > 9) return margin + advLeftPadding + i % 5 * 110 + 25;            
            else return 0;
        })
        .attr('y', (d, i) => {
            // if (i > 34) {
            //     return (i < 40) ? margin + advTopPadding + (i % 5) * 65 + 38: margin + advTopPadding + 5 * 65 + 10 + 38;
            // }
            if (i > 9) return margin + advTopPadding + Math.floor((i - 10) / 5) * 85 + 50;            
            else return 0;
        })
        .text((d, i) => {
            // if (i > 34) return (i > 39) ? -d : d;
            if (i > 9) return Math.abs(d);
            else return '';
        })
        .attr("fill", (d, i) => {
            // if (i > 34) return (d >= 0) ? "#007241" : "#A62F00";
            if (d < -2.5) return "#F80000";
            else if (d < -1.5) return "#B32428";
            else if (d < -0.7) return "#AB4E52";
            else if (d > 2.5) return "#66FF00";
            else if (d > 1.5) return "#34C924";
            else if (d > 0.7) return "#77DD77";
            else return "#828282";
        })
        .attr("font-size", (d, i) => {
            // if (i > 34) return 28;
            if (d < -3.5) return 28;
            else if (d < -2.5) return 26;
            else if (d < -1.5) return 24;
            else if (d > 3.5) return 28;
            else if (d > 2.5) return 26;
            else if (d > 1.5) return 24;
            else return 22
        })
        .attr("stroke", "black");
    
    

    


    
    



    const heroStats = await fetch('week1.txt').then(response => response.json());

    function pushStats(stat, bar, key) {
        stat = {radiant: 0};

        stat.all = Math.round(picks.reduce((acc, current, index) => {
            let pos = (index < 5) ? index : index - 5;
            let heroItem = heroStats[pos].data.heroStats.stats[heroIndex[current]].events[0][key];
            if (index === 5) stat.radiant = Math.round(acc);
            return heroItem * 35 + acc;
        }, 0));

        if (key === 'deaths') {
            bar.lastElementChild.style.width = stat.radiant * 100 / stat.all + '%';
            bar.firstElementChild.style.width = (100 - stat.radiant * 100 / stat.all) + '%';
        } else {
            bar.firstElementChild.style.width = stat.radiant * 100 / stat.all + '%';
            bar.lastElementChild.style.width = (100 - stat.radiant * 100 / stat.all) + '%';
        }
        
        bar.firstElementChild.firstElementChild.textContent = stat.radiant;        
        bar.lastElementChild.firstElementChild.textContent = stat.all - stat.radiant;
    }

    pushStats(statsBox.kills, document.querySelector('.kills .bar'), 'kills');
    pushStats(statsBox.deaths, document.querySelector('.deaths .bar'), 'deaths');
    pushStats(statsBox.assists, document.querySelector('.assists .bar'), 'assists');
    pushStats(statsBox.damage, document.querySelector('.damage .bar'), 'heroDamage');
    pushStats(statsBox.magicalDamage, document.querySelector('.magicalDamage .bar'), 'magicalDamage');
    pushStats(statsBox.physicalDamage, document.querySelector('.physicalDamage .bar'), 'physicalDamage');
    pushStats(statsBox.pureDamage, document.querySelector('.pureDamage .bar'), 'pureDamage');
    pushStats(statsBox.durability, document.querySelector('.durability .bar'), 'damageReceived');
    pushStats(statsBox.heal, document.querySelector('.heal .bar'), 'healingAllies');
    pushStats(statsBox.stun, document.querySelector('.stun .bar'), 'stunDuration');
    pushStats(statsBox.disable, document.querySelector('.disable .bar'), 'disableDuration');
    pushStats(statsBox.slow, document.querySelector('.slow .bar'), 'slowDuration');
    pushStats(statsBox.push, document.querySelector('.push .bar'), 'towerDamage');


    const roles = await fetch('heroRoles.txt').then(response => response.json());

    function pushStatsRoles(stat, bar, key) {
        stat = {radiant: 0};
        stat.all = picks.reduce((acc, current, index)  => {
            let rolesItem = roles.data.constants.heroes[heroIndex[current]].roles;
            if (index === 5) stat.radiant = acc;
            rolesItem.forEach(roleItem => {
                if (roleItem.roleId === key) acc += roleItem.level
            });
            return acc;
        }, 0);

        bar.firstElementChild.style.width = stat.radiant * 100 / stat.all + '%';
        bar.lastElementChild.style.width = (100 - stat.radiant * 100 / stat.all) + '%';
        
        bar.firstElementChild.firstElementChild.textContent = stat.radiant;        
        bar.lastElementChild.firstElementChild.textContent = stat.all - stat.radiant;
    }

    pushStatsRoles(statsBox.initiation, document.querySelector('.initiation .bar'), 'INITIATOR');
    pushStatsRoles(statsBox.nukes, document.querySelector('.nukes .bar'), 'NUKER');
    pushStatsRoles(statsBox.escape, document.querySelector('.escape .bar'), 'ESCAPE');

}


build();