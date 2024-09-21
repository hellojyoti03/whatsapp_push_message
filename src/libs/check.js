const isEmpty = (value) => {
	if (value === null || value === undefined || value.length === 0) {
		return true;
	} else {
		return false;
	}
};

const isArray = (value) => {
	return Array.isArray(value);
};

const isFriends = (value) => {
	if (value === 0) {
		return "Add Friend Request";
	} else if (value === 1) {
		return "Already Sent Friend Request";
	} else if (value === 2) {
		return "Pending The Request";
	} else if (value === 3) {
		return "Already Friends";
	}
};
module.exports = {
	isEmpty: isEmpty,
	isArray: isArray,
	isFriends: isFriends,
};
