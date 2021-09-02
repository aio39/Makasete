const text =
  '31)|抗議\n71)|光栄\n32)|拡大\n72)|初歩\n33) |推進\n73)|赤面\n34) |資金繰り\n74)祝福\n35)|昇給\n75)感激\n36)|倒産\n76)|恐縮\n37)|増大\n77)|若気\n38)輸送\n78)火災\n39)|增強\n79)|痛恨\n40)親元\n80)|不幸\n';

const stepA = text.replace(/[\w)|]/gi, '');
const stepB = stepA.split('\n').map((a) => a.trim());

console.log(stepA);
console.log(stepB);
console.log(stepB.length);
