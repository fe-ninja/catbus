exports.rule = {
    author: "远尘 <codedancerhua@gmail.com>",
    id: "css-image-url",
    description: "图片URL只能使用CDN地址",
    level: "error",
    validator: function(reporter, context, rawStr) {
        var reImg = /https?:\/\/[^/]+/g
        var img, imgUrl, lineNo

        // remove comments but keep line ending
        cssStr = rawStr.replace(/\/\*[\s\S]*\*\//g, function(str){
            return str.replace(/[^\n\r]*/g, '')
        })

        while(img = reImg.exec(cssStr)) {
            imgUrl = img[0]
            if (imgUrl !== 'https://i.alipayobjects.com') {
                reporter[this.level](this.description, getLineNo(cssStr, img.index), null, this, imgUrl)
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