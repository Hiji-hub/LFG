//начальный массив
let beginArray = [1292268027, 4208177045, 3449745100, 2152806943, 1246533442,
                    2765603797, 3095784866, 3954562528, 2131781922, 1494597801,
                    1542416948, 2072835048, 1982308318, 2727122214, 3982985100,
                    1383208256, 1546615134, 3239781594, 2975057966, 3851017179,
                    2295513152, 1611928035, 1645168538, 2906135137, 3505592508,
                    1389167599, 4226975540, 1694780732, 1504832094, 3857275200,
                    3048961809, 2120139920, 1899756374, 3472289026, 1729872945,
                    2494167800, 3878969575, 1584525770, 2113366391, 2638332170,
                    3420300767, 3944910643, 1489084863, 4054201279, 1448561080,
                    1701553313, 2632992004, 3940908415, 1473847756, 3137780740,
                    3125482661, 4059489247, 1575143070, 3517291277, 2493361248]
//сохранение и получение массива localstorage
let testArray = JSON.parse(localStorage.getItem('array'));     
    if(testArray==null)localStorage.setItem('array', JSON.stringify(beginArray));
//получение кнопок с классами - DOM
const GenBtn = document.querySelector('.gen')
const Try1Btn = document.querySelector('.try1')
const Try2Btn = document.querySelector('.try2')
const Try3Btn = document.querySelector('.try3')
const textArea = document.querySelector('.area')

const genButton = () => {
    textArea.textContent = ''
    textArea.textContent = generateFunc()
}
//генерация следующего числа
const generateFunc = () => {
    const mod = 4294967296
    const firstLag = 24
    const secondLag = 55
    let array = JSON.parse(localStorage.getItem('array'));
    let randomValue = (array[array.length-firstLag]+array[array.length-secondLag])%mod
    array.push(randomValue)
    array.splice(0,1)
    localStorage.removeItem('array')
    localStorage.setItem('array', JSON.stringify(array));
    return randomValue
}
//chi2-критерий
const chiSquare = () => {
    const chi2Label = document.querySelector('.chi2')
    const chi2StatusLabel = document.querySelector('.chi2-status')
    const valuesNumber = 320
    const modValue = 32 
    const teorValue = valuesNumber/modValue
    let state = []
    for(let i=0; i<modValue; i++)state.push(0)
    let tryArray = []
    for(let i=0; i<valuesNumber; i++){
        tryArray.push((generateFunc()) % modValue)
        state[tryArray[i]]++
    }
    let chi2 = 0

    for(let i=0; i<modValue; i++){
        chi2 += Math.pow(state[i]-teorValue, 2)/teorValue
    }
    
    const lowBord = 21.4335645
    const highBord = 41.42173583
    chi2Label.textContent = ' ' + chi2.toFixed(3)
    if((chi2>=lowBord)&&(chi2<=highBord)){
        chi2StatusLabel.textContent = ' пройден'
        chi2StatusLabel.classList.remove('not-passed')
        chi2StatusLabel.classList.add('passed')
    }
    else {
        chi2StatusLabel.textContent = ' не пройден'
        chi2StatusLabel.classList.remove('passed')
        chi2StatusLabel.classList.add('not-passed')
    }
}
//критерий Колмогорова-Смирнова
const KSTry = () => {
    const KnPlusLabel = document.querySelector('.kn-plus')
    const KnMinusLabel = document.querySelector('.kn-minus')
    const KSStatusLabel = document.querySelector('.Kn-status')

    const valuesNumber = 30
    const mod = 4294967296
    let tryArray = []
    for(let i=0; i<valuesNumber; i++)tryArray.push(generateFunc()/mod)
    tryArray.sort(function (a, b) {
        return b - a;
    })
    let maxPlus = 0
    let maxMinus = 0
    for(let i=0; i<valuesNumber; i++){
        if(maxPlus<(((i+1)/valuesNumber)-tryArray[i]))maxPlus = ((i+1)/valuesNumber)-tryArray[i]
        if(maxMinus<(tryArray[i]-(i/valuesNumber)))maxMinus = (tryArray[i]-(i/valuesNumber))
    }
    

    let kPlusN = Math.sqrt(valuesNumber)*maxPlus
    let kMinusN = Math.sqrt(valuesNumber)*maxMinus

    const lowBord = 0.1351
    const highBord = 1.1916
    KnPlusLabel.textContent = ' ' + kPlusN.toFixed(3)
    KnMinusLabel.textContent = ' ' + kMinusN.toFixed(3)
    if((kPlusN>=lowBord)&&(kPlusN<=highBord)&&(kMinusN>=lowBord)&&(kMinusN<=highBord)){
        KSStatusLabel.textContent = ' пройден'
        KSStatusLabel.classList.remove('not-passed')
        KSStatusLabel.classList.add('passed')
    }
    else {
        KSStatusLabel.textContent = ' не пройден'
        KSStatusLabel.classList.remove('passed')
        KSStatusLabel.classList.add('not-passed')
    }

}
//покер-критерий
const PokerTry = () => {
    const pokerLabel = document.querySelector('.poker')
    const pokerStatusLabel = document.querySelector('.poker-status')

    const valuesNumber = 400
    const modValue = 40
    const stirling = [0, 24, 50, 35, 10, 1]


    //рассчет вероятностей и создание 5 категорий
    let categories = []
    let r = 5
    let downPart = Math.pow(modValue, 5)
    for(let i=0; i<5; i++){
        let upPart = 1
        for(let j=r; j>0; j--)upPart *= (modValue-j+1)
        upPart *= stirling[r]
        let p = upPart/downPart
        categories.push([0,p])
        r--
    }

    //0 abcde
    //1 aabcd
    //2 aaabc, aabbc
    //3 aaaab, aaabb
    //4 aaaaa

    //получение чисел
    let tryArray = []
    for(let i=0; i<valuesNumber; i++) tryArray.push((generateFunc()) % modValue)

    //подсчет чисел каждой категории
    for(let i=0; i<valuesNumber/categories.length;i++){
        let categoryArr = []
        for(let j=0; j<categories.length;j++){
            categoryArr.push(tryArray[i*categories.length+j])
        }
        catNumber = 5
        while(categoryArr.length!=0){

            for(let j = 1; j<categoryArr.length; j++){
                if(categoryArr[0]===categoryArr[j]){
                    categoryArr.splice(j,1)
                    j-- 
                }
            }
            categoryArr.splice(0,1)
            catNumber-- 
        }
        categories[catNumber][0]++
    }

    //chi2 по категориям
    let chi2 = 0

    for(let i=0; i<categories.length; i++){
        let teorValue = categories[i][1]*(valuesNumber/5)
        chi2 += Math.pow(categories[i][0]-teorValue, 2)/teorValue
    }

    //вывод в лейбл
    const lowBord = 1.063623217
    const highBord = 7.77944034
    pokerLabel.textContent = ' ' + chi2.toFixed(3)
    if((chi2>=lowBord)&&(chi2<=highBord)){
        pokerStatusLabel.textContent = ' пройден'
        pokerStatusLabel.classList.remove('not-passed')
        pokerStatusLabel.classList.add('passed')
    }
    else {
        pokerStatusLabel.textContent = ' не пройден'
        pokerStatusLabel.classList.remove('passed')
        pokerStatusLabel.classList.add('not-passed')
    }
}
//listener-ы на кнопки
GenBtn.addEventListener('click', genButton)
Try1Btn.addEventListener('click', chiSquare)
Try2Btn.addEventListener('click', KSTry)
Try3Btn.addEventListener('click', PokerTry)

