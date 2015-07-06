var lightBox=(function(active,complete,boxId,resetBTN,closeBtn,bar,percentage,dataURL){
	var closeBtn=getEle(closeBtn);
	var resetBtn=getEle(resetBTN);
	var lightbox=getEle(boxId);
	var bar=getEle(bar);
	var percentage=getEle(percentage);
    var add;

	var progress=function(barEle,disEle,duration,start,finish,loadingFinish){
		var interval=duration/(finish-start);
			add=setInterval(function(){
			if(barEle.style.width){
				var w=barEle.style.width;
				var v=parseInt(w.substr(0,w.length-1));
				v++;
				var value=start+(finish-start)*v*0.01;
				disEle.innerHTML="Progress "+value+"%";
				barEle.style.width=v+"%";
				if(v==100){
					clearInterval(add);
					loadingFinish();
				}
			}
			else{
				barEle.style.width="1%";				
			}
		},interval);
	}
	var fetchData=function(url,callback){
		var xmlhttp;
		if (window.XMLHttpRequest){
			xmlhttp=new XMLHttpRequest();
		}
		else{
			xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
		}
		xmlhttp.onreadystatechange=function(){
			if (xmlhttp.readyState==4 && xmlhttp.status==200){
		    	if(callback){
		    		callback(JSON.parse(xmlhttp.responseText));
		    	}
		    }
		}
		xmlhttp.open("GET",url,true);
		xmlhttp.send();
	}
	function addClass( classname, element ) {
    	var cn = element.className;
    	if( cn.indexOf( classname ) != -1 ) {
    		return;
    	}
    	if( cn != '' ) {
    		classname = ' '+classname;
    	}
    	element.className = cn+classname;
    }
	function removeClass( classname, element ) {
	    var cn = element.className;
	    var rxp = new RegExp( "\\s?\\b"+classname+"\\b", "g" );
	    cn = cn.replace( rxp, '' );
	    element.className = cn;
	}
	function getEle(id){
		if(id){
			return document.getElementById(id);
		}
		return false;
	}
//---------Event------------------------------------------------------------------
    function onComplete(){
    	addClass(complete,lightbox);
    	percentage.innerHTML="This task is 100% completed";
    }
    function onActive(){
    	addClass(active,document.body);
    	fetchData(dataURL,function(data){
		progress(bar,percentage,
			data.data.lightbox.duration,
				data.data.lightbox.start,
					data.data.lightbox.finish,
						onComplete);
		});
    }
    function onInactive(){
        removeClass(active,document.body);
        removeClass(complete,lightbox);
        bar.style.width="";
        percentage.innerHTML="";
        if(add){clearInterval(add);}
    }
//---------Public Api---------------------------------------------------------------
    closeBtn.onclick=onInactive;
    resetBtn.onclick=function(){
    	onInactive();
    	onActive();
    }
    return {
     	LBActive: onActive,
     	LBInactive: onInactive 
    }	
})(
	"activeLightBox",// class name for showing the lightbox
	"complete",// class name for loading complete
	"lightBox", //id for the lightbox
	"resetBTN",
    "close",//id for the close btn
    "bar",// id for the progress bar
    "percentage",//id for percentage dispaly
    "js/data.json"//json url
);


