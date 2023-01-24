let weaponPower = 3
let energyPower = 3
led.plotBarGraph(energyPower, 5)


radio.onReceivedString(function (receivedString) {
    if (receivedString.charAt(0) == 'w'){
        weaponPower = parseInt(receivedString.charAt(3))
        serial.writeLine(receivedString)
    }
    if (receivedString.charAt(0) == 'e') {
        energyPower = parseInt(receivedString.charAt(3))
        serial.writeLine(receivedString)
        led.plotBarGraph(energyPower, 5)
    }

    if (receivedString.charAt(0) == 't' && input.buttonIsPressed(Button.A)) {
    } else {
        serial.writeLine(receivedString)
    }
})



let BPressed = 0
let APressed = 0

radio.setGroup(24)

input.onLogoEvent(TouchButtonEvent.Pressed, function () {
    if (weaponPower < 5) {
        energyPower++
        weaponPower--

        led.plotBarGraph(energyPower, 5)
        serial.writeLine("er:" + energyPower)
        serial.writeLine("wr:" + weaponPower)
    }

})
basic.forever(function () {
    if (APressed == 0 && input.buttonIsPressed(Button.A)) {
        APressed = 1
    } else {
        if (APressed == 1 && !(input.buttonIsPressed(Button.A))) {
            APressed = 0
        }
    }
    if (BPressed == 0 && input.buttonIsPressed(Button.B)) {
        BPressed = 1
        serial.writeLine("s:1")
    } else {
        if (BPressed == 1 && !(input.buttonIsPressed(Button.B))) {
            BPressed = 0
            serial.writeLine("s:0")
        }
    }
})
