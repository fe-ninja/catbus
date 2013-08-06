exports.rule = {
    author: "远尘 <codedancerhua@gmail.com>",
    id: "css-image-url",
    description: "图片URL只能使用支付宝线上地址",
    level: "error",
    validator: function(reporter, rawStr) {
        var reImg = /https?:\/\/[^/]+/g
        var img, imgUrl, lineNo

        while(img = reImg.exec(rawStr)) {
            imgUrl = img[0]
            if (imgUrl !== 'https://i.alipayobjects.com') {
                reporter[this.level](this.description, getLineNo(rawStr, img.index), null, this, imgUrl)
            }
        }

        function getLineNo(str, start) {
            var reLine = /\r?\n/g
            var line = 1
            var br

            while (br = reLine.exec(str)) {
                if (br.index < start) {
                    line++
                }
            }

            return line
        }
    }    
}