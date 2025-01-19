<template>
    <div>
        <fieldset>
            <legend>SubChildComponent1</legend>
            <div>
                <fieldset>
                    <legend>接收</legend>
                    <div>{{ info }}</div>
                </fieldset>
            </div>
        </fieldset>
    </div>
</template>

<script setup>
    import { ref,inject } from 'vue';

    let info=ref('');

    //
    info.value = inject('message')
</script>

<style scoped>
fieldset {
    border: 1px solid#ddd;
    padding: 12px;
}
 
legend {
    font-size: 18px;
    padding: 0 10px;
}
</style>