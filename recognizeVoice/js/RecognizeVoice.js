var RecognizeVoice = (function () {
    var that,id;

    var obj = function () {
        this.ajaxCount = 0;
        that = this;
        that.popId = [];
    };

    obj.prototype = {
        createHtml: function (data) {
            for(var i=0;i<data.length;i++){
                that.createDom(data[i])
            }
        },

        createDom: function (id) {
            $("#"+id).parent().append("<div class='start-taste-line''>"
            +"<hr class='hr hr1'>"
                +"<hr class='hr hr2'>"
                +"<hr class='hr hr3'>"
                +"<hr class='hr hr4'>"
                +"<hr class='hr hr5'>"
                +"<hr class='hr hr6'>"
                +"<hr class='hr hr7'>"
                +"<hr class='hr hr8'>"
                +"<hr class='hr hr9'>"
                +"<hr class='hr hr10'>"
                +"</div>"
                //+"<button class='btn-start-recognize'>转写</button>"
                +"<span>不想打字？点击试试"
                +"<a class='start"+id+"'>语音听写</a>"
                +"<a class='end"+id+"'>完成</a>"
                +"</span>");
            $(".start"+id).on("click", function () {
                $(".start"+id).css("display","none");
                $(".end"+id).css("display","inline");
                RecognizeVoice.recognizeStart(id)
            })
            $(".end"+id).on("click", function () {
                $(".start"+id).css("display","inline");
                $(".end"+id).css("display","none");
                RecognizeVoice.recognizeUpload(id)
            }).css("display","none")
        },
        recognizeStart: function (idName) {
            $(".start-taste-line").css("display","block");
            HZRecorder.get(function (rec) {
                recorder = rec;
                recorder.start();
            });
            id = idName;
            //语音时间不超过60秒
            that.timer = setTimeout(that.startRecognize,60000)
        },

        recognizeUpload: function () {
            $(".start-taste-line").css("display","none");
            clearTimeout(that.timer);
            that.startRecognize();
        },

        startRecognize: function () {
            recorder.stop();
            recorder.upload("http://192.168.1.156:8088/api/upload/listenFile", function (state, e) {
                switch (state) {
                    case 'uploading':
                        //var percentComplete = Math.round(e.loaded * 100 / e.total) + '%';
                        break;
                    case 'ok':
                        console.log("上传成功");
                        var message = JSON.parse(JSON.parse(e.target.responseText).data).data;
                        console.log(message);
                        addCase.$scope.startRecognize = false;
                        addCase.$scope.$apply()
                        message = $("#"+id).val() + message;
                        $("#"+id).val(message);
                        break;
                    case 'error':
                        alert("上传失败");
                        that.close();
                        break;
                    case 'cancel':
                        alert("上传被取消");
                        that.close();
                        break;
                }
            });
        }
    };

    return new obj();
})()