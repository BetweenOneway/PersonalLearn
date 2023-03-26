function learjQuery()
{
    var ulist=$('ul');
    var abc={};
    abc.age=10;
    abc.name='xiaohong';
}

function operateDOM()
{
    var
        input = $('#test-input'),
        select = $('#test-select'),
        textarea = $('#test-textarea');

console.log(input.val()); // 'test'
//input.val('abc@example.com'); // 文本框的内容已变为abc@example.com

console.log(select.val()); // 'BJ'
//select.val('SH'); // 选择框已变为Shanghai

console.log(textarea.val()); // 'Hello'
//textarea.val('Hi'); // 文本区域已更新为'Hi'
}
