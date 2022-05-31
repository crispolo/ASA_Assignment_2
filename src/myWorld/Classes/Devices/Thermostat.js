const GlobalUtilities = require('../../Utilities/GlobalUtilities');
const Device = require('./Device');
const Clock = require('../../../utils/Clock');

class Thermostat extends Device {
    #programs = ['Winter', 'Spring', 'Summer', 'Autumn'];

    constructor (name, status, movable, consumption, temperature, work_program) {
        super(name, status, movable, consumption);

        // consumption => kW/h

        this.work_program = work_program;
        this.tollerance = 2;
        this.desired_temperature = 22;
        this.start_time_ccs;
        this.set('temperature', temperature);
    }

    getWorkProgramName(prog_nr) {
        return this.#programs[prog_nr];
    }

    getWorkProgramName() {
        return getWorkProgramName(this.work_program);
    }

    getProgramNr() {
        return this.work_program;
    }

    setProgram(idx) {
        this.work_program = idx;
        console.log(this.#programs[idx] + ' set up');   
    }

    getTemperature() {
        return this.temperature;
    }

    setTemperature(temperature) {
        this.temperature = temperature; 
    }

    isCCSystemOn() {
        return this.getStatus();
    }

    getMinTemperature() {
        return this.desired_temperature - this.tollerance;
    }

    getMaxTemperature() {
        return this.desired_temperature + this.tollerance;
    }

    updateTemperature() {
        this.temperature = GlobalUtilities.generateRandomValue(18, 25);
    }

    switchCCSystemOn() {
        if (!this.isCCSystemOn()) {
            this.setStatus(true)

            this.start_time_heating = new Date(2022, 4, Clock.global.dd, Clock.global.hh, Clock.global.mm, 0, 0);

            return true;
        }

        return false;
    }

    switchCCSystemOff() {
        if (this.isCCSystemOn()) {
            this.setStatus(false)

            this.#calcConsumption(this.start_time_heating);
    
            return true;
        }

        return false;
    }

    #calcConsumption(start_time) {
        let end_time = new Date(2022, 4, Clock.global.dd, Clock.global.hh, Clock.global.mm, 0, 0);

        let diffMs = (end_time - start_time); // milliseconds between start and end time
        let diffDays = Math.floor(diffMs / 86400000); // days
        let diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
        let diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes

        let ddToMm = diffDays * 24 * 60;
        let hhToMM = diffHrs * 60;

        let elapsed_time = ddToMm + hhToMM + diffMins; 

        this.total_consumption += (elapsed_time / 60) * this.consumption; 
    }
}

module.exports = Thermostat;