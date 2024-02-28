const crypto = require('crypto')
function RandomAvatarFileName(file) {
    const extension = file.originalname.split('.').pop().toLowerCase();
    const randomBytes = crypto.randomBytes(10).toString('hex');
    return `${randomBytes}-${Date.now()}.${extension}`;
}
module.exports = {
    RandomAvatarFileName
}