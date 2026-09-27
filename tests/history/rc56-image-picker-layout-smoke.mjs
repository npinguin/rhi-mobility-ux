import fs from 'node:fs';

const vehicle=fs.readFileSync('src/ui/components/vehicle-visual-picker.js','utf8');
const charger=fs.readFileSync('src/ui/components/charger-visual-picker.js','utf8');
const dashboard=fs.readFileSync('src/ui/screens/mobility-dashboard.js','utf8');
const maintenance=fs.readFileSync('src/ui/screens/charger-maintenance.js','utf8');
const shell=fs.readFileSync('src/app/header-and-navigation.js','utf8');

for (const [name,src] of [['vehicle',vehicle],['charger',charger]]) {
  if (!src.includes('visual-choice-grid')) throw new Error(name+' picker is not image-first');
  if (!src.includes('visual-picker-apply')) throw new Error(name+' picker missing explicit apply stage');
  if (src.includes('Visual key')) throw new Error(name+' picker exposes technical visual key');
}
if(!dashboard.includes('data-vehicle-visual-choice')) throw new Error('vehicle image choices are not wired');
if(!maintenance.includes('data-charger-visual-choice')) throw new Error('charger image choices are not wired');
if(!maintenance.includes('writeLifecycleStatusAsync')) throw new Error('charger lifecycle regressed to optimistic write');
for (const token of ['.visual-choice-grid','.visual-choice-image img','@media(max-width:820px)','@media(max-width:520px)'])
  if(!shell.includes(token)) throw new Error('shared responsive picker token missing: '+token);
for (const token of ['rc.56 compact Vehicles body','object-fit:contain','height:146px'])
  if(!dashboard.includes(token)) throw new Error('compact Vehicles body gate missing: '+token);
for (const token of ['rc.56 compact Chargers body','object-fit:contain','height:126px'])
  if(!maintenance.includes(token)) throw new Error('compact Chargers body gate missing: '+token);
console.log('PASS rc.56 image-first picker and compact responsive body architecture');
