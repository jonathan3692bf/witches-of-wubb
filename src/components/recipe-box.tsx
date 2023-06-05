//import { useContext } from 'react';
//import { AbletonContext } from '../contexts/ableton-provider';
// import { LoggerContext } from '../contexts/logger-provider';

import useGrimoire from '~/hooks/use-grimoire';
import { getBackgroundColorFromType } from '~/lib/utils';

export default function RecipeBox() {
  //const { queuedClips, playingClips, stoppingClips } = useContext(AbletonContext);
  const { spellRecipe, generateNewSpell } = useGrimoire();
  // const { logger } = useContext(LoggerContext);
  console.log('spell receipe', spellRecipe);

  // Object.entries(spellRecipe).map(([type, recipe]) => {

  // })
  return (
    <div id='inner_recipe_box' className='flex flex-col max-w-full max-h-full'>
      <div id='recipe-bg' className='w-full bg-recipe-bg h-[320px] mx-auto mt-10'>
        <div id='title' className='mt-3 flex items-center justify-center gap-6'>
          <h4>Suggested Recipe</h4>
          <button
            id='new-spell-btn'
            style={{ backgroundImage: `url(src/assets/images/new-spell.gif)` }}
            className='bg-cover h-[80px] w-[80px] text-white py-2 px-4 rounded transition duration-200 ease-in-out hover:bg-opacity-50'
            onClick={generateNewSpell}
          ></button>
        </div>
        <div id='ingredients_contianer' className='gap-8 mx-auto mt-2 grid grid-cols-4 text-center'>
          {Object.entries(spellRecipe).map(([type, recipe]) => {
            return recipe ? (
              <div id={`ingredient-${recipe.rfid}-${type}`} className='scale-75' key={recipe.rfid}>
                <div
                  id='color-blur'
                  className={`absolute -inset-0 rounded-lg blur-xl z-0 ${getBackgroundColorFromType(
                    type,
                  )}`}
                ></div>
                <img
                  className='relative flex mt-3'
                  src={`public/ingredients/${recipe?.assetName}`}
                  alt={`ingredient-${recipe.ingredientName}`}
                ></img>
                <div id={`ingredient-${recipe.ingredientName}-label`} className='mt-4 relative'>
                  <div className='mt-3'>{`${recipe.ingredientName}`}</div>
                </div>
              </div>
            ) : null;
          })}
        </div>
      </div>
    </div>
  );
}
