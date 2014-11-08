define(function() {
    var checkType = {
        string: function(variable) {
            if (typeof variable == 'string' || variable instanceof String) {
                return true;
            }

            return false;
        },
        obj: function(variable) {
            if ((typeof variable == 'object') && (variable !== null)) {
                return true;
            }

            return false;
        },
        arr: function(variable) {
            if ((variable instanceof Array) && (variable !== null)) {
                return true;
            }

            return false;
        },
        func: function(variable) {
            if (typeof variable == 'function') {
                return true;
            }

            return false;
        },
        has: function(variable, property) {
            if (this.obj(variable)) {
                if (variable.hasOwnProperty(property)) {
                    return true;
                }
            }

            return false;
        },
        exists: function(variable) {
            if (typeof variable !== 'undefined') {
                return true;
            }

            return false;
        },
        toArr: function(variable) {
            if (!this.arr(variable)) {
                if (this.exists(variable)) {
                    return [variable];
                }

                return [];
            }

            return variable;
        },
        oneOf: function(target, variants) {
            if (this.exists(target) && this.exists(variants) && this.arr(variants)) {
                for (var index in variants) {
                    if (target === variants[index]) {
                        return true;
                    }
                }
            }

            return false;
        }
    };

    return checkType;
});