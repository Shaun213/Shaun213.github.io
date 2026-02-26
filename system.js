// Global Game State
const State = {
    mc: 2500,
    hp: 100,
    maxHp: 100,
    wave: 1,
    kills: 0,
    playerColor: 0x4b5320,
    active: false,
    save() {
        localStorage.setItem('zs_data', JSON.stringify({ mc: this.mc, kills: this.kills }));
    },
    load() {
        const data = localStorage.getItem('zs_data');
        if (data) Object.assign(this, JSON.parse(data));
    }
};

function setSkin(color) {
    State.playerColor = color;
}

State.load();
