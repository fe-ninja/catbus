exports.rule = {
    author: "远尘 <codedancerhua@gmail.com>",
    id: "css-image-url",
    description: "图片URL只能使用支付宝线上地址URL",
    level: "error",
    validator: function(reporter, context) {
        var reImg = /https?:\/\/[^/]+/g
        var img, imgUrl, lineNo

        while(img = reImg.exec(context)) {
            imgUrl = img[0]
            if (imgUrl !== 'https://img.alipay.com' && imgUrl !== 'https://i.alipayobjects.com') {
                reporter[this.level](this.description, getLineNo(context, img.index), null, this)
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