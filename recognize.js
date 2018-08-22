(function () {
    //var recorder;
    var that = me.define("recognize", {
        ctrl: function () {
            me.global.showPop("recognize");
            that.$scope.start = true;
            that.$scope.toRecognize = false;
        },
        recognizeStart: function () {
            that.$scope.start = false;
            HZRecorder.get(function (rec) {
                recorder = rec;
                recorder.start();
            });
            that.timer = setTimeout(that.startRecognize,60000)
        },


        recognizeUpload: function () {
            clearTimeout(that.timer);
            that.startRecognize();
        },

        startRecognize: function () {
            var hr = document.getElementsByClassName("hr")
            for(var i=0;i<hr.length;i++){
                hr[i].style.backgroundColor = "#cccccc";
            }
            that.$scope.toRecognize = true;
            recorder.stop();
            recorder.upload("音频上传地址", function (state, e) {
                switch (state) {
                    case 'uploading':
                        //var percentComplete = Math.round(e.loaded * 100 / e.total) + '%';
                        break;
                    case 'ok':
                        console.log("上传成功");
                        var message = JSON.parse(JSON.parse(e.target.responseText).data).data;
                        console.log(message);
                        me.global.hidePop("recognize", message);
                        break;
                    case 'error':
                        alert("上传失败");
                        break;
                    case 'cancel':
                        alert("上传被取消");
                        break;
                }
            });
        }
    });
})();