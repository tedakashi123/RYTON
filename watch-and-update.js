import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

const projectDir = 'c:/Users/USUARIO/Desktop/negocio';
let lastCommit = '';

console.log('👀 Iniciando monitor de cambios...');

function checkAndPush() {
  exec('cd "' + projectDir + '" && git status --porcelain', (error, stdout) => {
    if (error) {
      console.error('❌ Error checking status:', error);
      return;
    }
    
    if (stdout.trim()) {
      console.log('🔄 Cambios detectados, actualizando GitHub...');
      
      const commitMessage = 'Auto-update: ' + new Date().toLocaleString();
      const command = 'cd "' + projectDir + '" && git add . && git commit -m "' + commitMessage + '" && git push origin main';
      
      exec(command, (pushError, pushStdout, pushStderr) => {
        if (pushError) {
          console.error('❌ Error al hacer push:', pushError.message);
          if (pushStderr) console.error('Stderr:', pushStderr);
        } else {
          console.log('✅ Cambios subidos automáticamente');
          console.log('📝 Commit:', commitMessage);
        }
      });
    } else {
      console.log('✨ Sin cambios - ' + new Date().toLocaleTimeString());
    }
  });
}

// Revisa cada 30 segundos
setInterval(checkAndPush, 30000);

// Revisa inmediatamente al iniciar
checkAndPush();
