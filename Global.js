/**
 * Created by Administrator on 2017/5/18.
 */
// console.log(__dirname)
/*setInterval(function(){
    var d = new Date();
    console.log('现在是北京时间：'+d.getFullYear() +'年'+d.getMonth()+'月'+d.getDate()+'日'+d.getHours()+'时'
        +d.getMinutes()+'分'+d.getSeconds()+'秒')
},1000)
process.stdin.resume();
process.stdin.on('data',function(chunk){
    console.log('用户输入了：'+chunk)
})
process.stdin.resume();
var a;
var b;
process.stdout.write('请输入a的值');
process.stdin.on('data',function(chunk){
    if(!a){
        a = Number(chunk);
        process.stdout.write('请输入b的值');
    }else{
        b = Number(chunk);
        process.stdout.write('最后结果是'+(a+b))
    }
})*/
// var str = 'node';
// var bf = new Buffer(4);
// bf.write(str,1,4,'utf-8');
// console.log(bf)
var bf = new Buffer('node');
var bfs = new Buffer(10);
bfs.copy(bf);
bfs.slice(2,1)
console.log(bf);
console.log(bfs);