<template>
    <div>
        <h3>操作回放</h3>
                <div id="replay" ref="replayEl"></div>
                <div class="replay-controls">
                    <el-button-group>
                        <el-button @click="replayRecording" type="primary">
                            <el-icon><VideoPlay /></el-icon>
                            播放
                        </el-button>
                        <el-button @click="saveRecording">
                            <el-icon><Download /></el-icon>
                            保存
                        </el-button>
                    </el-button-group>
                </div>
    </div>
</template>

<script setup lang="ts">
import { replayRecording, saveRecording, replayEl } from '../components/evenetRecord'

import { newVedio } from '@/stores/vedio'

const vedioStore = newVedio()


console.log('vedioInfo', vedioStore.vedioInfo)




</script>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   