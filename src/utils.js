var id = 1;
module.exports = {
    getId: () => {
        return 'id_' + (id++);
    }
};
