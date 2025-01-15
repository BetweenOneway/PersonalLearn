<template>
    <button @click="add">增加</button>
    <button @click="minus">减少</button>
    <button @click="update" :disabled="0 == arr.length">更新</button>
    <ul>
        <li v-for="obj of arr" :key="obj.key">{{obj.name}}</li>
    </ul>
</template>

<script setup>
    import { ref } from 'vue';
    let keyGen = {
        _key:0,
    }
    Object.defineProperties(keyGen,
        {
            _key:{
                enumerable:false,
                configurable:false,
            },
            key:{
                get:function(){
                    let tempKey = this._key;
                    this._key++;
                    return tempKey;
                },
                set:function(val){

                }
            }
        }
    )
    const arr = ref([
        {
            key:keyGen.key,
            name:'arr 00'
        },
        {
            key:keyGen.key,
            name:'arr 01'
        },
    ])

    function add()
    {
        arr.value.push(
            {
                key:keyGen.key,
                name:"new add" + keyGen.key
            }
        )
    }

    function minus()
    {
        arr.value.pop();
    }

    function update()
    {
        let val = arr.value[0];
        val.name="new name"+' ' + keyGen.key;
    }
</script>